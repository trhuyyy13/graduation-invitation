import type { Guest } from "@/lib/guests";

function capitalize(word: string): string {
  return word ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}

/**
 * Fills {self}/{Self} with how Huy refers to himself with this guest
 * (guest.selfRef) and {you}/{You} with how Huy addresses the guest
 * (guest.salutation), e.g. "em"/"Anh" or "mình"/"Bạn".
 */
export function personalize(text: string, guest: Guest): string {
  const self = guest.selfRef || "mình";
  const you = guest.salutation || "bạn";

  return text
    .replaceAll("{Self}", capitalize(self))
    .replaceAll("{self}", self)
    .replaceAll("{You}", capitalize(you))
    .replaceAll("{you}", you);
}
