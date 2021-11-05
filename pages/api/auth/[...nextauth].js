import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@email.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const obj = Object.assign({}, credentials);

        const res = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          body: JSON.stringify(obj),
        });

        const data = await res.json();

        if (res.ok && data.id) {
          return data;
        }

        // login failed
        return null;
      },
    }),
  ],
  debug: true,
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    // signingKey: process.env.JWT_SIGNING_KEY,
    encryption: true,
  },
});
