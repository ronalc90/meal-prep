import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { signToken, JwtPayload } from '../utils/jwt';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import type { RegisterInput, LoginInput } from '../types/schemas';

export interface AuthResult {
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly name: string;
  };
  readonly token: string;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return { user, token };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
}

export async function getProfile(payload: JwtPayload) {
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      dietaryPreferences: true,
      weeklyBudget: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return user;
}
