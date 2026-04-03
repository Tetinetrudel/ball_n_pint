import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error("Le mot de passe doit contenir au minimum 8 caractères");
  }

  if (password.length > 250) {
    throw new Error("Le mot de passe ne doit pas contenir plus de 250 caractères");
  }

  return await bcrypt.hash(password, 10);
}

