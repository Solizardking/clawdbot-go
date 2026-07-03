// Package wallet provides local Solana keypair helpers for ClawdBot agents.
package wallet

import (
	"bytes"
	"crypto/ed25519"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const base58Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

// Keypair holds an ed25519 private key and its Solana public key.
type Keypair struct {
	PrivateKey ed25519.PrivateKey
	PublicKey  [32]byte
}

// Generate creates a fresh ed25519 keypair suitable for Solana.
func Generate() (*Keypair, error) {
	pub, priv, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("generate keypair: %w", err)
	}
	var publicKey [32]byte
	copy(publicKey[:], pub)
	return &Keypair{PrivateKey: priv, PublicKey: publicKey}, nil
}

// Load reads a Solana CLI keypair JSON file.
func Load(path string) (*Keypair, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read keypair %s: %w", path, err)
	}
	secret, err := parseSecret(data)
	if err != nil {
		return nil, err
	}
	return FromSecret(secret)
}

// FromSecret builds a keypair from a 64-byte Solana secret key.
func FromSecret(secret []byte) (*Keypair, error) {
	if len(secret) != ed25519.PrivateKeySize {
		return nil, fmt.Errorf("keypair must be %d bytes, got %d", ed25519.PrivateKeySize, len(secret))
	}
	derived := ed25519.NewKeyFromSeed(secret[:ed25519.SeedSize])
	if !bytes.Equal(derived[ed25519.SeedSize:], secret[ed25519.SeedSize:]) {
		return nil, fmt.Errorf("keypair public key does not match private seed")
	}
	var publicKey [32]byte
	copy(publicKey[:], derived[ed25519.SeedSize:])
	return &Keypair{PrivateKey: derived, PublicKey: publicKey}, nil
}

// Ensure returns the existing keypair at path or creates one when missing.
func Ensure(path string) (*Keypair, bool, error) {
	if strings.TrimSpace(path) == "" {
		return nil, false, fmt.Errorf("keypair path is required")
	}
	if existing, err := Load(path); err == nil {
		return existing, false, nil
	} else if !os.IsNotExist(err) {
		return nil, false, err
	}
	kp, err := Generate()
	if err != nil {
		return nil, false, err
	}
	if err := Save(path, kp, false); err != nil {
		return nil, false, err
	}
	return kp, true, nil
}

// Save writes the keypair in Solana CLI JSON-array format with 0600 permissions.
func Save(path string, kp *Keypair, overwrite bool) error {
	if strings.TrimSpace(path) == "" {
		return fmt.Errorf("keypair path is required")
	}
	if kp == nil || len(kp.PrivateKey) != ed25519.PrivateKeySize {
		return fmt.Errorf("valid keypair is required")
	}
	if !overwrite {
		if _, err := os.Stat(path); err == nil {
			return fmt.Errorf("keypair already exists at %s", path)
		} else if !os.IsNotExist(err) {
			return err
		}
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}
	values := make([]int, len(kp.PrivateKey))
	for i, b := range kp.PrivateKey {
		values[i] = int(b)
	}
	data, err := json.Marshal(values)
	if err != nil {
		return err
	}
	return os.WriteFile(path, append(data, '\n'), 0o600)
}

// Pubkey returns the base58 Solana public key.
func (kp *Keypair) Pubkey() string {
	if kp == nil {
		return ""
	}
	return Base58Encode(kp.PublicKey[:])
}

// IsValidPubkey reports whether value is a base58-encoded 32-byte public key.
func IsValidPubkey(value string) bool {
	decoded, err := Base58Decode(strings.TrimSpace(value))
	return err == nil && len(decoded) == 32
}

// Base58Decode decodes a Bitcoin/Solana base58 string.
func Base58Decode(s string) ([]byte, error) {
	alphabet := []byte(base58Alphabet)
	lookup := [256]int{}
	for i := range lookup {
		lookup[i] = -1
	}
	for i, c := range alphabet {
		lookup[c] = i
	}

	result := make([]byte, 0, len(s))
	for _, c := range []byte(s) {
		carry := lookup[c]
		if carry < 0 {
			return nil, fmt.Errorf("invalid base58 char %q", c)
		}
		for j := len(result) - 1; j >= 0; j-- {
			carry += 58 * int(result[j])
			result[j] = byte(carry & 0xff)
			carry >>= 8
		}
		for carry > 0 {
			result = append([]byte{byte(carry & 0xff)}, result...)
			carry >>= 8
		}
	}
	for _, c := range []byte(s) {
		if c != alphabet[0] {
			break
		}
		result = append([]byte{0}, result...)
	}
	return result, nil
}

// Base58Encode encodes bytes with the Bitcoin/Solana base58 alphabet.
func Base58Encode(b []byte) string {
	alphabet := []byte(base58Alphabet)
	result := []byte{}
	for _, byt := range b {
		carry := int(byt)
		for j := len(result) - 1; j >= 0; j-- {
			carry += 256 * int(result[j])
			result[j] = byte(carry % 58)
			carry /= 58
		}
		for carry > 0 {
			result = append([]byte{byte(carry % 58)}, result...)
			carry /= 58
		}
	}
	for _, byt := range b {
		if byt != 0 {
			break
		}
		result = append([]byte{0}, result...)
	}
	encoded := make([]byte, len(result))
	for i, idx := range result {
		encoded[i] = alphabet[idx]
	}
	return string(encoded)
}

func parseSecret(data []byte) ([]byte, error) {
	var bytes64 []byte
	if err := json.Unmarshal(data, &bytes64); err == nil {
		return bytes64, nil
	}
	var ints []int
	if err := json.Unmarshal(data, &ints); err != nil {
		return nil, fmt.Errorf("parse keypair: %w", err)
	}
	bytes64 = make([]byte, len(ints))
	for i, v := range ints {
		if v < 0 || v > 255 {
			return nil, fmt.Errorf("keypair byte %d out of range: %d", i, v)
		}
		bytes64[i] = byte(v)
	}
	return bytes64, nil
}
