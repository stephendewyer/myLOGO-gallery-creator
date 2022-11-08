import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from '../../../library/auth';
import { connectToDatabase } from '../../../library/db';

export default NextAuth({

    session: {

        strategy: "jwt"

    },

    providers: [

        CredentialsProvider({

            async authorize(credentials) {

                const client = await connectToDatabase();

                const usersCollection = client.db().collection('users');

                const user = await usersCollection.findOne({ email: credentials.email });

                if ((credentials.email === "") | (credentials.password === "")) {
                    client.close();
                    throw new Error('all fields required');
                }

                if (!credentials.email.includes('@')) {
                    client.close();
                    throw new Error('missing an @ symbol in email address');
                }

                if (!user && (credentials.email !== "") && (credentials.password !== "")) {
                    client.close();
                    throw new Error('no user found with sent email address');
                }

                const isValid = await verifyPassword(
                    credentials.password, 
                    user.password
                );

                if (!isValid) {
                    client.close();
                    throw new Error('incorrect password');
                }

                const result = { email: user.email };

                client.close();

                return result;
                // DON'T INCLUDE THE ENTIRE USER OBJECT BECAUSE THE USER PASSWORD IS IN USER OBJECT

                // RESULT WILL ENCODE AS A JASON WEB TOKEN

            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
});