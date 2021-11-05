// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_URI,
      dialect: 'mysql',
    }
  );

  const User = db.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
    },
  });

  User.sync({ force: false }).then(async () => {
    console.log('User synced');
  });

  const user = JSON.parse(req.body);

  const foundUser = await User.findOne({
    where: {
      email: user.email,
    },
  });

  if (foundUser) {
    const auth = await bcrypt.compare(user.password, foundUser.password);

    if (auth) {
      res.status(200).json({ email: foundUser.email, id: foundUser.id });
      return;
    } else {
      res.status(403).json({ message: 'Password does not match' });
      return;
    }
  } else {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    const newUser = await User.create({
      email: user.email,
      password: user.password,
    });

    res.status(200).json({ email: newUser.email, id: newUser.id });
    return;
  }

  res.status(200).json({ message: 'Error' });
}
