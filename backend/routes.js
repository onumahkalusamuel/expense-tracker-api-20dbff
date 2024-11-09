import {Sequelize, DataTypes} from 'sequelize';
import * as bcrypt from 'bcrypt';

const sequelize = new Sequelize({dialect: 'sqlite', storage: ':memory:'});

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Expense = sequelize.define('Expense', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM,
    values: ["Groceries", "Leisure", "Electronics", "Utilities", "Clothing", "Health", "Others"],
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
});


// Set up associations
User.hasMany(Expense, {foreignKey: 'userId', onDelete: 'CASCADE'});
Expense.belongsTo(User, {foreignKey: 'userId'});

try {
  await sequelize.authenticate();
  await sequelize.sync({force: true});
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default function (fastify, options, done) {
  // Register an account
  fastify.post('/sign-up', async (request, reply) => {
    const {email, password, name} = request.body;

    const whereConditions = {};
    whereConditions.email = {[Sequelize.Op.eq]: email};

    const existingUser = await User.findOne({where: whereConditions});

    if (existingUser?.id) return reply.code(403).send({message: 'Email in use.'});

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({name, email, password: hashedPassword})

    if (!newUser) return reply.code(400).send({message: 'Unable to create account at the moment.'});

    reply.send({message: 'Account created successfully.'})
  });

  // Log into account
  fastify.post('/log-in', async (request, reply) => {
    const {email, password} = request.body;

    const user = await User.findOne({where: {email}});

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.code(403).send({message: 'Invalid username or password'});
    }

    const token = fastify.jwt.sign({userId: user.id}, {expiresIn: '6h'})

    reply.send({token, name: user.name, message: 'Logged in successfully.'});
  });

  // Get expenses
  fastify.get('/expenses', {preHandler: [fastify.authenticate]}, async (request, reply) => {

    let {fromDate, toDate, filter} = request.query;

    switch (filter) {
      case 'PAST_WEEK': {
        const now = new Date();
        const pastWeek = new Date();
        pastWeek.setDate(now.getDate() - 7);  // Subtract 7 days from today
        pastWeek.setHours(0, 0, 0, 0);  // Set to start of the day in local time
        fromDate = pastWeek.toISOString();  // Get date in YYYY-MM-DD format
        toDate = now.toISOString();  // Today
        break;
      }
      case 'PAST_MONTH': {
        const now = new Date();
        const pastMonth = new Date();
        pastMonth.setMonth(now.getMonth() - 1);  // Subtract 1 month from today
        pastMonth.setHours(0, 0, 0, 0);  // Set to start of the day in local time
        fromDate = pastMonth.toISOString();  // Get date in YYYY-MM-DD format
        toDate = now.toISOString();  // Today
        break;
      }
      case 'PAST_3_MONTHS': {
        const now = new Date();
        const pastThreeMonths = new Date();
        pastThreeMonths.setMonth(now.getMonth() - 3);  // Subtract 3 months from today
        pastThreeMonths.setHours(0, 0, 0, 0);  // Set to start of the day in local time
        fromDate = pastThreeMonths.toISOString();  // Get date in YYYY-MM-DD format
        toDate = now.toISOString();  // Today
        break;
      }
      case 'CUSTOM': {
        // Assuming fromDate and toDate are provided in the request for custom range,
        // You might want to validate them here as well.
        fromDate = new Date(fromDate).toISOString();
        toDate = new Date(toDate).toISOString();
        break;
      }
      default: {
        // Handle a default case, e.g., set to a specific range or return an error
        const now = new Date();
        fromDate = now.toISOString();  // Default to today
        toDate = now.toISOString();    // Default to today
        break;
      }
    }

    // Fetch expenses with date range filter
    const expenses = await Expense.findAll({
      where: {
        userId: request.user.userId,
        createdAt: {
          [Sequelize.Op.between]: [fromDate, toDate]  // Apply date range
        }
      },
      order: [['createdAt', 'DESC']]
    });

    reply.send({data: expenses, fromDate: fromDate.split('T')[0], toDate: toDate.split('T')[0]});
  });
  // Create new expense
  fastify.post('/expenses', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    // request.body;
    const expense = await Expense.create({
      userId: request.user.userId,
      title: request.body.title,
      category: request.body.category,
      amount: request.body.amount,
    });

    reply.send(expense);
  });
  // get an expense
  fastify.get('/expenses/:id', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id} = request.params;
    const expense = await Expense.findOne({where: {id, userId: request.user.userId}});
    if (!expense) return reply.code(404).send({message: "Expense not found."});
    reply.send(expense);
  });
  // Update expense
  fastify.put('/expenses/:id', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id} = request.params;
    const expense = await Expense.findOne({where: {id, userId: request.user.userId}});
    if (!expense) return reply.code(404).send({message: "Expense not found."});

    expense.title = request.body.title;
    expense.category = request.body.category;
    expense.amount = request.body.amount;

    await expense.save();

    reply.send(expense);
  });
  // Delete expense
  fastify.delete('/expenses/:id', {preHandler: [fastify.authenticate]}, async (request, reply) => {
    const {id} = request.params;
    const expense = await Expense.findOne({where: {id, userId: request.user.userId}});
    if (!expense) return reply.code(404).send({message: "Expense not found."});
    await expense.destroy();
    reply.code(204).send();
  });

  done();
}
