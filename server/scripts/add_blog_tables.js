import { query } from '../config/db.js';

async function addTables() {
  try {
    console.log('🏗️  Adding Blog tables...');
    
    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BlogPosts' AND xtype='U')
      CREATE TABLE BlogPosts (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          content NVARCHAR(MAX) NOT NULL,
          author_id INT NOT NULL,
          image1 NVARCHAR(MAX) NULL,
          image2 NVARCHAR(MAX) NULL,
          created_at DATETIME2 DEFAULT GETDATE(),
          CONSTRAINT FK_Blog_User FOREIGN KEY (author_id) REFERENCES Users(id)
      );
    `);

    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Comments' AND xtype='U')
      CREATE TABLE Comments (
          id INT IDENTITY(1,1) PRIMARY KEY,
          post_id INT NOT NULL,
          user_id INT NOT NULL,
          content NVARCHAR(MAX) NOT NULL,
          created_at DATETIME2 DEFAULT GETDATE(),
          CONSTRAINT FK_Comment_Post FOREIGN KEY (post_id) REFERENCES BlogPosts(id) ON DELETE CASCADE,
          CONSTRAINT FK_Comment_User FOREIGN KEY (user_id) REFERENCES Users(id)
      );
    `);

    console.log('✅ Tables added successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding tables:', err.message);
    process.exit(1);
  }
}

addTables();
