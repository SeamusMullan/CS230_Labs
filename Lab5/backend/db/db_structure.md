# DB Layout

## Users Table

```sql
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- For storing bcrypt hashes
  email VARCHAR(100) NOT NULL UNIQUE,
  address VARCHAR(255)
);
```

## TravelLogs Table

```sql
CREATE TABLE TravelLogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  post_date DATE NOT NULL,
  tags TEXT, -- Will store JSON array as string
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

## JourneyPlans Table

```sql
CREATE TABLE JourneyPlans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  locations TEXT, -- Will store JSON array as string
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  activities TEXT, -- Will store JSON array as string
  description TEXT,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```
