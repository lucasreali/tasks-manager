'use server';
import { prisma } from '@/lib/prisma';
import { hashSync } from 'bcrypt-ts';
export const registerAction = async (_prevState: any, formData: FormData) => {
    const entries = Array.from(formData.entries());
    const data = Object.fromEntries(entries) as {
        name: string;
        email: string;
        password: string;
    };

    const { name, email, password } = data;

    if (!name || !email || !password) {
        return {
            message: 'All fields are required',
            success: false,
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user) {
            return {
                message: 'User already exists',
                success: false,
            }
        }

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashSync(password),
            },
        });

        return {
            
            success: true,
        }
    } catch (error) {
        console.error('Error creating user:', error);
    }
};
