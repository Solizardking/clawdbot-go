package laws

import "testing"

func TestValidateSixLawHarness(t *testing.T) {
	if err := Validate(); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
	if got := len(OnChain()); got != 3 {
		t.Fatalf("OnChain() len = %d, want 3", got)
	}
	if got := len(OffChain()); got != 3 {
		t.Fatalf("OffChain() len = %d, want 3", got)
	}
}

func TestMarkdownContainsAllLaws(t *testing.T) {
	markdown := Markdown()
	for _, law := range Six {
		if !contains(markdown, "Law "+law.ID) {
			t.Fatalf("Markdown() missing law %s", law.ID)
		}
	}
}

func contains(s, sub string) bool {
	return len(sub) == 0 || len(s) >= len(sub) && (s == sub || contains(s[1:], sub) || s[:len(sub)] == sub)
}
