const bcrypt = require('bcryptjs');
const db = require('./db');

console.log('Seeding QuizCraft database...');

// 1. Clear existing seed data if any
db.exec('PRAGMA foreign_keys = OFF;');
db.exec('DELETE FROM attempt_answers;');
db.exec('DELETE FROM attempts;');
db.exec('DELETE FROM questions;');
db.exec('DELETE FROM quizzes;');
db.exec('DELETE FROM categories;');
db.exec('DELETE FROM users;');
db.exec('PRAGMA foreign_keys = ON;');

// 2. Insert Default Demo User
const hashedPassword = bcrypt.hashSync('Password123!', 10);
const insertUser = db.prepare(`
  INSERT INTO users (id, name, email, password)
  VALUES (?, ?, ?, ?)
`);
insertUser.run(1, 'Alex Morgan', 'alex@quizcraft.edu', hashedPassword);

// 3. Define Categories (6 categories)
const categories = [
  { id: 1, name: 'Programming', description: 'Core programming concepts, syntax, data structures, and algorithms.', icon: 'code' },
  { id: 2, name: 'Web Development', description: 'HTML5, modern CSS3 styling, JavaScript fundamentals, and full-stack architecture.', icon: 'globe' },
  { id: 3, name: 'Database Management', description: 'Relational design, normalization, SQL queries, indexing, and transactions.', icon: 'database' },
  { id: 4, name: 'Mathematics', description: 'Discrete mathematics, logic, probability, and foundational computer science math.', icon: 'calculator' },
  { id: 5, name: 'Computer Networks', description: 'OSI layers, TCP/IP protocol suite, DNS, routing, and network security basics.', icon: 'network' },
  { id: 6, name: 'General Knowledge', description: 'Computer history, ethical hacking foundations, and tech innovations.', icon: 'lightbulb' }
];

const insertCategory = db.prepare(`
  INSERT INTO categories (id, name, description, icon)
  VALUES (?, ?, ?, ?)
`);

for (const cat of categories) {
  insertCategory.run(cat.id, cat.name, cat.description, cat.icon);
}

// 4. Define Quizzes and Questions
// 18 quizzes (3 per category) * 5 questions each = 90 questions
const quizData = [
  // CATEGORY 1: Programming
  {
    category_id: 1,
    title: 'Python Essentials & Syntax',
    description: 'Master the fundamental building blocks of Python, from indentation to list comprehensions.',
    difficulty: 'Easy',
    duration: 300,
    questions: [
      {
        question: 'Which of the following data types in Python is immutable?',
        a: 'List', b: 'Tuple', c: 'Dictionary', d: 'Set',
        correct: 'B',
        explanation: 'Tuples cannot be modified after creation, making them immutable sequences in Python.'
      },
      {
        question: 'What is the correct file extension for Python script files?',
        a: '.pt', b: '.pyt', c: '.py', d: '.pyth',
        correct: 'C',
        explanation: 'Standard Python script source files end with the .py extension.'
      },
      {
        question: 'How do you define a function in Python?',
        a: 'function myFunc():', b: 'def myFunc():', c: 'func myFunc():', d: 'define myFunc():',
        correct: 'B',
        explanation: 'The `def` keyword introduces a function definition in Python.'
      },
      {
        question: 'What will `type([1, "two", 3.0])` return in Python?',
        a: '<class \'tuple\'>', b: '<class \'array\'>', c: '<class \'list\'>', d: '<class \'object\'>',
        correct: 'C',
        explanation: 'Square brackets `[...]` denote a built-in Python `list` object.'
      },
      {
        question: 'Which operator is used for exponentiation (power) in Python?',
        a: '^', b: '**', c: '^^', d: '//',
        correct: 'B',
        explanation: '`**` calculates the power of numbers (e.g. `2 ** 3 = 8`). `^` is bitwise XOR.'
      }
    ]
  },
  {
    category_id: 1,
    title: 'Object-Oriented Programming Concepts',
    description: 'Deepen your grasp of OOP principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.',
    difficulty: 'Medium',
    duration: 360,
    questions: [
      {
        question: 'Which OOP pillar restricts direct access to some of an object\'s components to protect state integrity?',
        a: 'Inheritance', b: 'Polymorphism', c: 'Encapsulation', d: 'Compilation',
        correct: 'C',
        explanation: 'Encapsulation bundles data with the methods that operate on that data and hides internal object state.'
      },
      {
        question: 'What allows a subclass to provide a specific implementation of a method defined in its superclass?',
        a: 'Method Overriding', b: 'Method Overloading', c: 'Object Encapsulation', d: 'Static Casting',
        correct: 'A',
        explanation: 'Method overriding enables a child class to provide a specialized version of an inherited parent method.'
      },
      {
        question: 'A class that cannot be instantiated and is meant solely to be a base class is known as:',
        a: 'A Static Class', b: 'An Abstract Class', c: 'A Sealed Class', d: 'A Singleton Class',
        correct: 'B',
        explanation: 'Abstract classes declare a blueprint or interface and cannot be directly instantiated.'
      },
      {
        question: 'Which relationship best models the concept of "Composition" in OOP?',
        a: '"is-a" relationship', b: '"has-a" relationship', c: '"uses-a" relationship', d: '"depends-on" relationship',
        correct: 'B',
        explanation: 'Composition and aggregation represent "has-a" relationships (e.g., a Car has an Engine).'
      },
      {
        question: 'What does the term "Polymorphism" literally mean in computer science?',
        a: 'Single implementation', b: 'Many forms', c: 'Private visibility', d: 'Code replication',
        correct: 'B',
        explanation: 'Polymorphism comes from Greek meaning "many forms", allowing objects of different classes to respond to identical calls.'
      }
    ]
  },
  {
    category_id: 1,
    title: 'Data Structures & Algorithmic Complexity',
    description: 'Test your knowledge on stacks, queues, trees, and Big-O time and space complexity.',
    difficulty: 'Hard',
    duration: 420,
    questions: [
      {
        question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
        a: 'O(1)', b: 'O(n)', c: 'O(log n)', d: 'O(n log n)',
        correct: 'C',
        explanation: 'Each comparison in a balanced BST halves the remaining search space, giving O(log n) time.'
      },
      {
        question: 'Which data structure operates on a Last-In, First-Out (LIFO) order?',
        a: 'Queue', b: 'Stack', c: 'Priority Queue', d: 'Linked List',
        correct: 'B',
        explanation: 'A Stack strictly obeys LIFO order, where elements pushed last are popped first.'
      },
      {
        question: 'What is the worst-case time complexity of QuickSort?',
        a: 'O(n log n)', b: 'O(n)', c: 'O(n^2)', d: 'O(2^n)',
        correct: 'C',
        explanation: 'When poor pivots are repeatedly chosen (e.g., already sorted array with extreme pivots), QuickSort degrades to O(n^2).'
      },
      {
        question: 'Which graph traversal algorithm uses a FIFO Queue to visit nodes level-by-level?',
        a: 'Depth-First Search (DFS)', b: 'Breadth-First Search (BFS)', c: 'Dijkstra\'s Algorithm', d: 'Kruskal\'s Algorithm',
        correct: 'B',
        explanation: 'Breadth-First Search (BFS) explores neighboring vertices level by level using a FIFO Queue.'
      },
      {
        question: 'In a Hash Table, what occurs when two distinct keys hash to the exact same index?',
        a: 'Memory Leak', b: 'Hash Collision', c: 'Deadlock', d: 'Stack Overflow',
        correct: 'B',
        explanation: 'A Hash Collision happens when two distinct keys produce the same hash code or bucket index.'
      }
    ]
  },

  // CATEGORY 2: Web Development
  {
    category_id: 2,
    title: 'HTML5 & Modern CSS3 Fundamentals',
    description: 'Test your core understanding of semantic HTML tags, CSS box model, and styling techniques.',
    difficulty: 'Easy',
    duration: 300,
    questions: [
      {
        question: 'Which HTML5 element represents self-contained, independent syndicatable content (like a blog post)?',
        a: '<section>', b: '<article>', c: '<aside>', d: '<main>',
        correct: 'B',
        explanation: 'The `<article>` element is specifically intended for standalone, self-contained items like forum posts or news articles.'
      },
      {
        question: 'Which CSS property determines the stacking order of positioned elements along the z-axis?',
        a: 'display', b: 'position', c: 'z-index', d: 'float',
        correct: 'C',
        explanation: '`z-index` specifies the z-order of positioned elements; elements with larger indices overlap those with smaller ones.'
      },
      {
        question: 'What are the four components of the CSS Box Model, from the inside out?',
        a: 'Margin, Border, Padding, Content', b: 'Content, Padding, Border, Margin', c: 'Content, Border, Padding, Margin', d: 'Padding, Content, Margin, Border',
        correct: 'B',
        explanation: 'The CSS box model starts with Content at the center, surrounded by Padding, then Border, and finally Margin.'
      },
      {
        question: 'Which CSS property creates a flex container when set to "flex"?',
        a: 'flex-direction', b: 'align-items', c: 'display', d: 'justify-content',
        correct: 'C',
        explanation: 'Setting `display: flex;` activates the Flexbox layout model for direct child items.'
      },
      {
        question: 'Which HTML attribute specifies an alternate text for an image if the image cannot be displayed?',
        a: 'title', b: 'src', c: 'alt', d: 'caption',
        correct: 'C',
        explanation: 'The `alt` attribute provides accessible text descriptions for screen readers and fallback when image loading fails.'
      }
    ]
  },
  {
    category_id: 2,
    title: 'JavaScript DOM & Modern ES6+',
    description: 'Explore JavaScript event handling, array methods, arrow functions, and asynchronous promises.',
    difficulty: 'Medium',
    duration: 360,
    questions: [
      {
        question: 'What is the primary difference between `let` and `var` in modern JavaScript?',
        a: '`let` is function-scoped, `var` is block-scoped', b: '`let` is block-scoped, `var` is function-scoped', c: '`let` cannot be reassigned', d: '`var` throws an error on redeclaration',
        correct: 'B',
        explanation: '`let` introduces block scope (inside curly braces), whereas `var` is hoisted and scoped to the enclosing function.'
      },
      {
        question: 'Which array method creates a brand new array populated with the results of calling a function on every element?',
        a: 'filter()', b: 'forEach()', c: 'map()', d: 'reduce()',
        correct: 'C',
        explanation: '`map()` transforms each item in an array and returns a new array with the mapped values.'
      },
      {
        question: 'What will `typeof null` return in JavaScript?',
        a: '"null"', b: '"undefined"', c: '"object"', d: '"boolean"',
        correct: 'C',
        explanation: 'Due to a historical bug in the initial JavaScript implementation, `typeof null` returns `"object"`.'
      },
      {
        question: 'Which keyword allows JavaScript functions to pause execution until a Promise settles?',
        a: 'defer', b: 'await', c: 'yield', d: 'pause',
        correct: 'B',
        explanation: 'The `await` operator can only be used inside `async` functions to wait for a Promise to resolve or reject.'
      },
      {
        question: 'How do you attach an event listener to a button element with id "btn" in vanilla JS?',
        a: 'btn.listen("click", fn)', b: 'document.getElementById("btn").addEventListener("click", fn)', c: 'document.btn.clickEvent(fn)', d: 'btn.attach("click", fn)',
        correct: 'B',
        explanation: '`addEventListener` is the standard DOM API for attaching event handler callbacks.'
      }
    ]
  },
  {
    category_id: 2,
    title: 'Full-Stack Web Architecture & REST APIs',
    description: 'Understand client-server architecture, HTTP methods, status codes, CORS, and stateless communication.',
    difficulty: 'Hard',
    duration: 420,
    questions: [
      {
        question: 'Which HTTP status code signifies that a requested resource was successfully created on the server?',
        a: '200 OK', b: '201 Created', c: '204 No Content', d: '301 Moved Permanently',
        correct: 'B',
        explanation: 'HTTP `201 Created` indicates that the request has succeeded and led to the creation of a resource.'
      },
      {
        question: 'What does CORS stand for in web browsers and servers?',
        a: 'Client Object Request State', b: 'Cross-Origin Resource Sharing', c: 'Centralized Origin Routing System', d: 'Cross-Operational REST Standard',
        correct: 'B',
        explanation: 'Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts cross-domain resource requests.'
      },
      {
        question: 'Which HTTP method should be idempotent and used to replace an entire existing resource representation?',
        a: 'POST', b: 'PUT', c: 'PATCH', d: 'CONNECT',
        correct: 'B',
        explanation: '`PUT` replaces the entire target resource with the uploaded payload and is defined as idempotent.'
      },
      {
        question: 'What is the main characteristic of RESTful web architecture regarding session state?',
        a: 'Server stores all client UI state in memory', b: 'Client requests must contain all necessary information (Stateless)', c: 'Server connects persistent WebSocket pipes', d: 'Client cannot make GET requests',
        correct: 'B',
        explanation: 'REST is stateless: each request from client to server must contain all of the information necessary to understand and complete the request.'
      },
      {
        question: 'What HTTP header does a client commonly send to specify the media type of the payload sent in the request body?',
        a: 'Accept', b: 'Content-Type', c: 'User-Agent', d: 'Authorization',
        correct: 'B',
        explanation: '`Content-Type: application/json` informs the receiving server of the MIME type of the enclosed data.'
      }
    ]
  },

  // CATEGORY 3: Database Management
  {
    category_id: 3,
    title: 'SQL Fundamentals & Relational Concepts',
    description: 'Master core SQL queries: SELECT, INSERT, UPDATE, DELETE, and WHERE filtering.',
    difficulty: 'Easy',
    duration: 300,
    questions: [
      {
        question: 'Which SQL clause is used to filter rows based on specific conditions?',
        a: 'ORDER BY', b: 'GROUP BY', c: 'WHERE', d: 'HAVING',
        correct: 'C',
        explanation: 'The `WHERE` clause filters individual records before grouping or ordering operations take place.'
      },
      {
        question: 'Which SQL statement is used to insert new records into a database table?',
        a: 'ADD ROW', b: 'INSERT INTO', c: 'UPDATE TABLE', d: 'APPEND TO',
        correct: 'B',
        explanation: '`INSERT INTO table_name (columns) VALUES (values);` inserts new rows into a relational table.'
      },
      {
        question: 'What does a PRIMARY KEY constraint enforce on a table column?',
        a: 'Values can be NULL and duplicated', b: 'Values must be unique and non-NULL', c: 'Values must be integers only', d: 'Values must point to another table',
        correct: 'B',
        explanation: 'A Primary Key uniquely identifies each record in a database table and strictly prohibits NULL values.'
      },
      {
        question: 'Which keyword sorts the result set in descending order?',
        a: 'ASC', b: 'DESC', c: 'DOWN', d: 'REVERSE',
        correct: 'B',
        explanation: '`ORDER BY column_name DESC;` sorts query outputs from highest to lowest.'
      },
      {
        question: 'Which SQL function counts the total number of rows matching a criteria?',
        a: 'SUM()', b: 'TOTAL()', c: 'COUNT()', d: 'ROWS()',
        correct: 'C',
        explanation: '`COUNT(*)` or `COUNT(column)` returns the number of rows matching the query criteria.'
      }
    ]
  },
  {
    category_id: 3,
    title: 'Normalization & Schema Design',
    description: 'Learn database normalization forms (1NF, 2NF, 3NF), foreign keys, and ER modeling.',
    difficulty: 'Medium',
    duration: 360,
    questions: [
      {
        question: 'A relational table is in First Normal Form (1NF) if and only if:',
        a: 'Every column has a foreign key', b: 'All attributes contain only atomic (indivisible) values', c: 'All non-key columns depend on the primary key', d: 'It contains no foreign keys',
        correct: 'B',
        explanation: '1NF requires that each column contains atomic values, with no repeating groups or nested arrays.'
      },
      {
        question: 'Second Normal Form (2NF) eliminates which of the following anomalies?',
        a: 'Transitive dependencies', b: 'Partial dependencies on composite keys', c: 'Multi-valued dependencies', d: 'Null pointer errors',
        correct: 'B',
        explanation: '2NF requires 1NF plus every non-prime attribute must be fully functionally dependent on the entire candidate key.'
      },
      {
        question: 'What constraint establishes a relationship between two tables by pointing to a primary key in another table?',
        a: 'UNIQUE', b: 'CHECK', c: 'FOREIGN KEY', d: 'INDEX',
        correct: 'C',
        explanation: 'A `FOREIGN KEY` enforces referential integrity between child and parent tables.'
      },
      {
        question: 'Third Normal Form (3NF) requires that there are no:',
        a: 'Atomic values', b: 'Transitive functional dependencies', c: 'Primary keys', d: 'Relationships',
        correct: 'B',
        explanation: '3NF removes transitive dependencies where a non-key column depends on another non-key column.'
      },
      {
        question: 'In an Entity-Relationship (ER) diagram, what shape traditionally represents an Entity?',
        a: 'Diamond', b: 'Oval', c: 'Rectangle', d: 'Circle',
        correct: 'C',
        explanation: 'In Chen\'s ER notation, rectangles represent entities, diamonds represent relationships, and ovals represent attributes.'
      }
    ]
  },
  {
    category_id: 3,
    title: 'Transactions, ACID Properties & Indexing',
    description: 'Dive deep into database transaction isolation, commit/rollback, and B-Tree indexing.',
    difficulty: 'Hard',
    duration: 420,
    questions: [
      {
        question: 'What does the "A" in ACID database properties stand for?',
        a: 'Authentication', b: 'Atomicity', c: 'Availability', d: 'Asynchronous',
        correct: 'B',
        explanation: 'Atomicity guarantees that all statements in a transaction complete successfully, or all are rolled back.'
      },
      {
        question: 'Which ACID property guarantees that committed transactions survive system crashes or power failures?',
        a: 'Consistency', b: 'Isolation', c: 'Durability', d: 'Atomicity',
        correct: 'C',
        explanation: 'Durability ensures that once a transaction commits, its changes are permanently recorded in non-volatile storage.'
      },
      {
        question: 'What data structure is most widely implemented for relational database indexing?',
        a: 'B-Tree / B+ Tree', b: 'Min Heap', c: 'Linked List', d: 'Splay Tree',
        correct: 'A',
        explanation: 'B-Trees and B+ Trees keep data sorted and allow search, sequential access, insertions, and deletions in logarithmic time.'
      },
      {
        question: 'What concurrency phenomenon occurs when a transaction reads uncommitted changes from another active transaction?',
        a: 'Non-repeatable read', b: 'Dirty read', c: 'Phantom read', d: 'Lost update',
        correct: 'B',
        explanation: 'A Dirty Read happens when Transaction A reads data modified by Transaction B before Transaction B has committed.'
      },
      {
        question: 'What command discards all uncommitted modifications made during the current transaction?',
        a: 'COMMIT', b: 'ROLLBACK', c: 'TRUNCATE', d: 'DROP',
        correct: 'B',
        explanation: '`ROLLBACK` restores the database to its state prior to the beginning of the transaction.'
      }
    ]
  },

  // CATEGORY 4: Mathematics
  {
    category_id: 4,
    title: 'Foundational Computer Science Math',
    description: 'Binary number systems, hexadecimal conversion, bitwise operations, and modular arithmetic.',
    difficulty: 'Easy',
    duration: 300,
    questions: [
      {
        question: 'What is the decimal equivalent of the binary number `1011`?',
        a: '9', b: '11', c: '13', d: '15',
        correct: 'B',
        explanation: 'In binary: 1*8 + 0*4 + 1*2 + 1*1 = 8 + 0 + 2 + 1 = 11.'
      },
      {
        question: 'What is the hexadecimal representation of the decimal number 255?',
        a: 'FE', b: 'FF', c: '100', d: 'EE',
        correct: 'B',
        explanation: '255 = 15 * 16 + 15, which is represented in hexadecimal as 0xFF.'
      },
      {
        question: 'What is the result of the bitwise AND operation `5 & 3`?',
        a: '1', b: '7', c: '2', d: '0',
        correct: 'A',
        explanation: '5 in binary is 0101, 3 is 0011. 0101 & 0011 = 0001, which is 1 in decimal.'
      },
      {
        question: 'What is the value of `29 mod 7`?',
        a: '1', b: '2', c: '4', d: '0',
        correct: 'A',
        explanation: '29 divided by 7 is 4 with a remainder of 1 (4 * 7 = 28; 29 - 28 = 1).'
      },
      {
        question: 'How many bits make up one single byte?',
        a: '4', b: '8', c: '16', d: '32',
        correct: 'B',
        explanation: 'By international standard definition, 1 byte consists of exactly 8 bits.'
      }
    ]
  },
  {
    category_id: 4,
    title: 'Discrete Mathematics & Propositional Logic',
    description: 'Explore truth tables, logical connectives, set theory, and combinatorics.',
    difficulty: 'Medium',
    duration: 360,
    questions: [
      {
        question: 'Under what condition is the logical implication `P → Q` FALSE?',
        a: 'P is false, Q is true', b: 'P is true, Q is false', c: 'Both P and Q are false', d: 'Both P and Q are true',
        correct: 'B',
        explanation: 'An implication is only false when the antecedent (P) is true and the consequent (Q) is false.'
      },
      {
        question: 'If Set A has 4 elements, what is the cardinality of its Power Set P(A)?',
        a: '8', b: '12', c: '16', d: '24',
        correct: 'C',
        explanation: 'The power set contains 2^n subsets. For n = 4, 2^4 = 16 subsets.'
      },
      {
        question: 'De Morgan\'s Law states that `NOT (A AND B)` is equivalent to:',
        a: '(NOT A) AND (NOT B)', b: '(NOT A) OR (NOT B)', c: 'NOT (A OR B)', d: 'A OR B',
        correct: 'B',
        explanation: 'According to De Morgan\'s Law, the negation of a conjunction is the disjunction of the negations.'
      },
      {
        question: 'How many distinct permutations can be formed from the 4 letters in the word "MATH"?',
        a: '12', b: '16', c: '24', d: '64',
        correct: 'C',
        explanation: 'All 4 letters are distinct, so the number of permutations is 4! = 4 × 3 × 2 × 1 = 24.'
      },
      {
        question: 'What is the name of a graph where every vertex has an edge to every other vertex?',
        a: 'Bipartite Graph', b: 'Complete Graph', c: 'Directed Acyclic Graph', d: 'Planar Graph',
        correct: 'B',
        explanation: 'A Complete Graph (denoted K_n) is a simple graph in which every pair of distinct vertices is connected by a unique edge.'
      }
    ]
  },
  {
    category_id: 4,
    title: 'Probability & Matrix Mathematics for CS',
    description: 'Matrix multiplication, eigenvalues, conditional probability, and Bayes\' Theorem.',
    difficulty: 'Hard',
    duration: 420,
    questions: [
      {
        question: 'If you roll two fair 6-sided dice, what is the probability of rolling a sum of 7?',
        a: '1/12', b: '1/6', c: '5/36', d: '7/36',
        correct: 'B',
        explanation: 'There are 6 favorable outcomes out of 36 possibilities: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1). 6/36 = 1/6.'
      },
      {
        question: 'To multiply matrix A (size 3x4) and matrix B (size p x q), what MUST p be?',
        a: '3', b: '4', c: '12', d: 'Any integer',
        correct: 'B',
        explanation: 'Matrix multiplication AB requires the number of columns of A (4) to equal the number of rows of B (p = 4).'
      },
      {
        question: 'What is the determinant of a 2x2 matrix with rows [3, 2] and [1, 4]?',
        a: '10', b: '14', c: '12', d: '7',
        correct: 'A',
        explanation: 'det([a,b; c,d]) = ad - bc. Here: (3 * 4) - (2 * 1) = 12 - 2 = 10.'
      },
      {
        question: 'Bayes\' theorem provides a formula to calculate which of the following?',
        a: 'Marginal variance', b: 'Conditional probability P(A|B)', c: 'Standard deviation', d: 'Matrix trace',
        correct: 'B',
        explanation: 'Bayes\' Theorem calculates posterior probability: P(A|B) = [P(B|A) * P(A)] / P(B).'
      },
      {
        question: 'If an event is guaranteed to never occur, its probability is:',
        a: '-1', b: '0', c: '0.5', d: 'Undefined',
        correct: 'B',
        explanation: 'Probabilities range from 0 (impossible event) to 1 (certain event).'
      }
    ]
  },

  // CATEGORY 5: Computer Networks
  {
    category_id: 5,
    title: 'Networking Basics & The OSI Model',
    description: 'Understand the 7 layers of the OSI reference model, MAC addresses, and network topologies.',
    difficulty: 'Easy',
    duration: 300,
    questions: [
      {
        question: 'How many layers are defined in the standard OSI reference model?',
        a: '4', b: '5', c: '7', d: '9',
        correct: 'C',
        explanation: 'The OSI model defines 7 distinct layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.'
      },
      {
        question: 'At which OSI layer do IP routers primarily operate to forward packets?',
        a: 'Data Link Layer (Layer 2)', b: 'Network Layer (Layer 3)', c: 'Transport Layer (Layer 4)', d: 'Session Layer (Layer 5)',
        correct: 'B',
        explanation: 'Routers operate at Layer 3 (Network Layer) using logical IP addresses to route packets.'
      },
      {
        question: 'What is the length of a standard IPv4 address in bits?',
        a: '32 bits', b: '64 bits', c: '128 bits', d: '256 bits',
        correct: 'A',
        explanation: 'IPv4 addresses are 32 bits (4 bytes) long, typically represented in dotted decimal notation.'
      },
      {
        question: 'Which network device connects multiple computers within a single Local Area Network (LAN) using MAC addresses?',
        a: 'Modem', b: 'Network Switch', c: 'Default Gateway', d: 'DNS Server',
        correct: 'B',
        explanation: 'Network switches operate at Layer 2 to filter and forward frames between LAN ports using hardware MAC addresses.'
      },
      {
        question: 'Which protocol automatically assigns IP addresses to devices joining a network?',
        a: 'DNS', b: 'DHCP', c: 'SMTP', d: 'ARP',
        correct: 'B',
        explanation: 'Dynamic Host Configuration Protocol (DHCP) automatically provides IP addresses and subnet parameters to network clients.'
      }
    ]
  },
  {
    category_id: 5,
    title: 'TCP/IP Protocols & Transport Layer',
    description: 'Compare TCP vs UDP, port numbers, the 3-way handshake, and reliable delivery.',
    difficulty: 'Medium',
    duration: 360,
    questions: [
      {
        question: 'What sequence of packets establishes a TCP connection (the 3-way handshake)?',
        a: 'ACK, SYN, SYN-ACK', b: 'SYN, SYN-ACK, ACK', c: 'FIN, ACK, FIN-ACK', d: 'HELLO, READY, GO',
        correct: 'B',
        explanation: 'TCP 3-way handshake: Client sends SYN, Server replies with SYN-ACK, Client acknowledges with ACK.'
      },
      {
        question: 'Which transport layer protocol is connectionless, prioritizing low latency over guaranteed delivery?',
        a: 'TCP', b: 'UDP', c: 'SCTP', d: 'BGP',
        correct: 'B',
        explanation: 'User Datagram Protocol (UDP) is lightweight and connectionless, ideal for video streaming and gaming.'
      },
      {
        question: 'What is the standard port number for HTTPS traffic encrypted with TLS?',
        a: '80', b: '8080', c: '443', d: '22',
        correct: 'C',
        explanation: 'Port 443 is assigned by IANA for HTTPS (HTTP over SSL/TLS). Port 80 is unencrypted HTTP.'
      },
      {
        question: 'What mechanism does TCP use to avoid overwhelming the receiver\'s buffer?',
        a: 'Flow Control (Sliding Window)', b: 'Port Forwarding', c: 'Subnet Masking', d: 'DNS Resolution',
        correct: 'A',
        explanation: 'TCP uses sliding window flow control to prevent a fast sender from overrunning a slow receiver.'
      },
      {
        question: 'Which protocol translates domain names (e.g., example.com) into IP addresses?',
        a: 'HTTP', b: 'DNS', c: 'FTP', d: 'SNMP',
        correct: 'B',
        explanation: 'The Domain Name System (DNS) translates human-readable hostnames into numeric IP addresses.'
      }
    ]
  },
  {
    category_id: 5,
    title: 'Routing, Subnetting & Network Architecture',
    description: 'Master CIDR notation, subnet calculations, NAT, and distance-vector vs link-state routing.',
    difficulty: 'Hard',
    duration: 420,
    questions: [
      {
        question: 'How many usable host IP addresses are available in a `/24` IPv4 subnet?',
        a: '256', b: '254', c: '255', d: '128',
        correct: 'B',
        explanation: 'A /24 subnet has 2^8 = 256 total addresses, minus 2 reserved (network address and broadcast address), giving 254 usable hosts.'
      },
      {
        question: 'What technology maps multiple private local IP addresses to a single public IP address?',
        a: 'VLAN', b: 'NAT (Network Address Translation)', c: 'QoS', d: 'BGP',
        correct: 'B',
        explanation: 'NAT allows an entire private local network to share a single public IP on the wider Internet.'
      },
      {
        question: 'Which of the following routing protocols is a Link-State protocol using Dijkstra\'s shortest path algorithm?',
        a: 'RIP', b: 'OSPF', c: 'BGP', d: 'EGP',
        correct: 'B',
        explanation: 'Open Shortest Path First (OSPF) is an interior gateway link-state protocol that uses Dijkstra\'s algorithm.'
      },
      {
        question: 'What is the standard loopback IP address in IPv4?',
        a: '192.168.1.1', b: '10.0.0.1', c: '127.0.0.1', d: '255.255.255.255',
        correct: 'C',
        explanation: '127.0.0.1 (localhost) is reserved for local host loopback testing.'
      },
      {
        question: 'What is the length of an IPv6 address in bits?',
        a: '64 bits', b: '128 bits', c: '256 bits', d: '512 bits',
        correct: 'B',
        explanation: 'IPv6 uses 128-bit addresses, written in 8 groups of 4 hexadecimal digits.'
      }
    ]
  },

  // CATEGORY 6: General Knowledge & Ethical Hacking
  {
    category_id: 6,
    title: 'Computer History & Technological Milestones',
    description: 'Test your knowledge on key milestones, pioneers, and foundational computing developments.',
    difficulty: 'Easy',
    duration: 300,
    questions: [
      {
        question: 'Who is widely regarded as the world\'s first computer programmer for writing an algorithm for Babbage\'s Analytical Engine?',
        a: 'Alan Turing', b: 'Ada Lovelace', c: 'Grace Hopper', d: 'Charles Babbage',
        correct: 'B',
        explanation: 'Ada Lovelace translated and annotated Luigi Menabrea\'s memoir, appending an algorithm to compute Bernoulli numbers.'
      },
      {
        question: 'Which early network created by the US DoD laid the technical foundations of the modern Internet?',
        a: 'BITNET', b: 'ARPANET', c: 'USENET', d: 'NSFNET',
        correct: 'B',
        explanation: 'ARPANET (Advanced Research Projects Agency Network) pioneered packet switching and the TCP/IP protocol suite.'
      },
      {
        question: 'Who created the World Wide Web and the first web browser while working at CERN in 1989?',
        a: 'Steve Jobs', b: 'Tim Berners-Lee', c: 'Bill Gates', d: 'Linus Torvalds',
        correct: 'B',
        explanation: 'Sir Tim Berners-Lee invented the World Wide Web, HTML, URI/URL, and HTTP in 1989-1990.'
      },
      {
        question: 'Who created the Linux operating system kernel in 1991?',
        a: 'Richard Stallman', b: 'Dennis Ritchie', c: 'Linus Torvalds', d: 'Ken Thompson',
        correct: 'C',
        explanation: 'Finnish student Linus Torvalds announced and released the initial Linux kernel in 1991.'
      },
      {
        question: 'What famous theoretical computer model was proposed in 1936 to formalize the concept of algorithm execution?',
        a: 'Von Neumann Architecture', b: 'Turing Machine', c: 'Harvard Architecture', d: 'ENIAC Machine',
        correct: 'B',
        explanation: 'Alan Turing introduced the Turing Machine to mathematically define computation and limits of decidability.'
      }
    ]
  },
  {
    category_id: 6,
    title: 'Ethical Hacking: Fundamentals & Reconnaissance',
    description: 'Foundations of ethical hacking, legal boundaries, passive vs active reconnaissance (NPTEL Ref).',
    difficulty: 'Medium',
    duration: 360,
    questions: [
      {
        question: 'What key characteristic distinguishes an Ethical Hacker ("White Hat") from a malicious attacker?',
        a: 'Use of proprietary tools', b: 'Prior authorization, legal permission, and adherence to scope', c: 'Only targeting web servers', d: 'Refusal to use command line tools',
        correct: 'B',
        explanation: 'Ethical hackers possess written permission and explicit authorization from system owners to test security within scope.'
      },
      {
        question: 'In the CIA Triad of information security, what does the letter "I" stand for?',
        a: 'Identification', b: 'Integrity', c: 'Inspection', d: 'Interoperability',
        correct: 'B',
        explanation: 'The CIA Triad consists of Confidentiality, Integrity (guarding against improper modification), and Availability.'
      },
      {
        question: 'Which reconnaissance activity is classified as "Passive Information Gathering"?',
        a: 'Port scanning target IP with Nmap', b: 'Querying public WHOIS records and DNS registries', c: 'Vulnerability scanning with Nessus', d: 'Sending malicious payloads to test web firewalls',
        correct: 'B',
        explanation: 'Passive reconnaissance gathers information without directly contacting or triggering logs on the target system.'
      },
      {
        question: 'Which popular network mapping utility is used to discover active hosts and open ports on a network?',
        a: 'Wireshark', b: 'Nmap', c: 'John the Ripper', d: 'Burp Suite',
        correct: 'B',
        explanation: 'Nmap (Network Mapper) is the quintessential open-source utility for network exploration and port scanning.'
      },
      {
        question: 'What is "Social Engineering" in the context of cybersecurity?',
        a: 'Writing multi-threaded network daemons', b: 'Manipulating individuals into divulging confidential credentials', c: 'Reverse engineering machine code binaries', d: 'Configuring firewall routing tables',
        correct: 'B',
        explanation: 'Social engineering targets human vulnerabilities through psychological manipulation, pretexting, or phishing.'
      }
    ]
  },
  {
    category_id: 6,
    title: 'Cybersecurity: Vulnerabilities & Defense',
    description: 'Explore OWASP Top 10 vulnerabilities: SQL Injection, XSS, encryption, and defense-in-depth.',
    difficulty: 'Hard',
    duration: 420,
    questions: [
      {
        question: 'Which vulnerability occurs when untrusted user input is directly concatenated into a dynamic SQL database query?',
        a: 'Cross-Site Scripting (XSS)', b: 'SQL Injection (SQLi)', c: 'Cross-Site Request Forgery (CSRF)', d: 'Buffer Overflow',
        correct: 'B',
        explanation: 'SQL Injection occurs when user inputs alter query structure, preventable through parameterized queries.'
      },
      {
        question: 'What is the primary defense against Cross-Site Scripting (XSS) in web applications?',
        a: 'Storing plaintext passwords', b: 'Output encoding and strict Content Security Policy (CSP)', c: 'Disabling HTTPS encryption', d: 'Using HTTP GET for all forms',
        correct: 'B',
        explanation: 'Encoding user-supplied output and enforcing a strong CSP prevents browsers from executing injected script tags.'
      },
      {
        question: 'Which cryptographic algorithm is an asymmetric (public-key) cipher widely used for secure key exchange?',
        a: 'AES-256', b: 'DES', c: 'RSA', d: 'Blowfish',
        correct: 'C',
        explanation: 'RSA is an asymmetric cipher utilizing a public key for encryption and a private key for decryption.'
      },
      {
        question: 'What security principle dictates that users and services should only be granted the minimum permissions necessary?',
        a: 'Defense in Depth', b: 'Principle of Least Privilege', c: 'Security by Obscurity', d: 'Fail-Safe Defaults',
        correct: 'B',
        explanation: 'The Principle of Least Privilege (PoLP) minimizes potential damage by restricting access privileges to essential duties.'
      },
      {
        question: 'In password security, what is a "Salt"?',
        a: 'An encryption key shared with all users', b: 'Random data added to a password before hashing to defend against rainbow tables', c: 'A plaintext backup copy', d: 'A symmetric AES block',
        correct: 'B',
        explanation: 'A salt is a unique random string appended to passwords prior to hashing, rendering precomputed rainbow tables ineffective.'
      }
    ]
  }
];

const insertQuiz = db.prepare(`
  INSERT INTO quizzes (id, category_id, title, description, difficulty, duration, question_count)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertQuestion = db.prepare(`
  INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

let quizIdCounter = 1;
let totalQuestionsInserted = 0;

for (const q of quizData) {
  insertQuiz.run(
    quizIdCounter,
    q.category_id,
    q.title,
    q.description,
    q.difficulty,
    q.duration,
    q.questions.length
  );

  for (const item of q.questions) {
    insertQuestion.run(
      quizIdCounter,
      item.question,
      item.a,
      item.b,
      item.c,
      item.d,
      item.correct,
      item.explanation
    );
    totalQuestionsInserted++;
  }

  quizIdCounter++;
}

// 5. Insert Sample Attempt History for Demo User (Alex Morgan)
const insertAttempt = db.prepare(`
  INSERT INTO attempts (id, user_id, quiz_id, score, total_questions, percentage, started_at, completed_at)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-2 days'), datetime('now', '-2 days', '+4 minutes'))
`);

const insertAttemptAnswer = db.prepare(`
  INSERT INTO attempt_answers (attempt_id, question_id, selected_answer, correct_answer, is_correct)
  VALUES (?, ?, ?, ?, ?)
`);

// Attempt 1: Python Essentials (Score: 5/5 = 100%)
insertAttempt.run(1, 1, 1, 5, 5, 100.0);
insertAttemptAnswer.run(1, 1, 'B', 'B', 1);
insertAttemptAnswer.run(1, 2, 'C', 'C', 1);
insertAttemptAnswer.run(1, 3, 'B', 'B', 1);
insertAttemptAnswer.run(1, 4, 'C', 'C', 1);
insertAttemptAnswer.run(1, 5, 'B', 'B', 1);

// Attempt 2: HTML5 & CSS3 (Score: 4/5 = 80%)
const insertAttempt2 = db.prepare(`
  INSERT INTO attempts (id, user_id, quiz_id, score, total_questions, percentage, started_at, completed_at)
  VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-1 day'), datetime('now', '-1 day', '+3 minutes'))
`);
insertAttempt2.run(2, 1, 4, 4, 5, 80.0);
insertAttemptAnswer.run(2, 16, 'B', 'B', 1);
insertAttemptAnswer.run(2, 17, 'C', 'C', 1);
insertAttemptAnswer.run(2, 18, 'B', 'B', 1);
insertAttemptAnswer.run(2, 19, 'A', 'C', 0); // wrong answer for demonstration
insertAttemptAnswer.run(2, 20, 'C', 'C', 1);

console.log('Seeding completed successfully!');
console.log(`- Categories: ${categories.length}`);
console.log(`- Quizzes: ${quizData.length}`);
console.log(`- Questions: ${totalQuestionsInserted}`);
console.log(`- Seed User: alex@quizcraft.edu (Password: Password123!)`);
