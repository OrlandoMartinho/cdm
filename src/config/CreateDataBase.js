const mysql = require('mysql2');
const keysBd = require('../private/keyDb.json');
const admCredenciais=require('../private/CredenciaisADM.json')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require('jsonwebtoken');
const secretKey=require('../private/secretKey.json');
// Chaves de conexão com o banco de dados
const dbConfig = {
  host: keysBd.host,
  user: keysBd.user,
  password: keysBd.password,
  database: keysBd.database
};

// Função para verificar se o banco de dados existe
function checkIfDatabaseExists(connection, databaseName) {
  return new Promise((resolve, reject) => {
    connection.query(`SHOW DATABASES LIKE '${databaseName}'`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results.length > 0);
    });
  });
}

// Função para criar o banco de dados
function createDatabase(connection, databaseName) {
  return new Promise((resolve, reject) => {
    connection.query(`CREATE DATABASE ${databaseName}`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// Função para verificar se a tabela existe
function checkIfTableExists(connection, tableName) {
  return new Promise((resolve, reject) => {
    connection.query(`SHOW TABLES LIKE '${tableName}'`, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results.length > 0);
    });
  });
}

// Função para executar uma consulta SQL
function runQuery(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err); 
        return;
      }
      resolve();
    });
  });
}

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password
});

// Conectar ao banco de dados
connection.connect(async (err) => {
  if (err) {
  
  }

  console.log('Criação Do Banco De Dados Feito com Sucesso.');

  try {
    // Verificar se o banco de dados existe e criar se não existir
    const databaseExists = await checkIfDatabaseExists(connection, dbConfig.database);
    if (!databaseExists) {
      await createDatabase(connection, dbConfig.database);
      console.log(`Banco de dados ${dbConfig.database} criado com sucesso.`);
    } else {
      console.log(`O banco de dados ${dbConfig.database} já existe.`);
    }

    // Conectar ao banco de dados específico
    connection.changeUser({ database: dbConfig.database });
   
    // Definir as consultas CREATE TABLE para cada tabela
    const createTableQueries = [
      `CREATE TABLE IF NOT EXISTS usuarios (
          id_usuario INT AUTO_INCREMENT PRIMARY KEY,
          nome TEXT DEFAULT NULL,
          senha TEXT DEFAULT NULL,
          email VARCHAR(45) DEFAULT NULL,
          genero VARCHAR(45) DEFAULT NULL,
          data_de_nascimento DATE DEFAULT NULL,
          morada varchar(255) DEFAULT NULL,
          token TEXT DEFAULT NULL,
          tipo INT DEFAULT NULL,
          numero_do_bi VARCHAR(45) DEFAULT null,
          telefone VARCHAR(255) DEFAULT null,
          responsavel VARCHAR(255) DEFAULT null,
          data_de_ingresso DATE DEFAULT null,
          cargo VARCHAR(45) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`,
       
      `CREATE TABLE IF NOT EXISTS contatos (
          id_contato INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(45) DEFAULT NULL,
          mensagem VARCHAR(255) DEFAULT NULL,
          nome VARCHAR(255) DEFAULT NULL,
          data_do_contato DATETIME DEFAULT current_timestamp()
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`,

      `CREATE TABLE IF NOT EXISTS funerais (
          id_funeral INT AUTO_INCREMENT PRIMARY KEY,
          id_usuario INT NOT NULL,
          nome_completo VARCHAR(255) DEFAULT null,
          nome_do_responsavel VARCHAR(255) DEFAULT null,
          numero_do_bi VARCHAR(255) DEFAULT null,
          filiacao VARCHAR(255) DEFAULT null,
          causa_da_morte VARCHAR(255) DEFAULT null,
          data_de_falecimento DATE DEFAULT null,
          data_de_nascimento DATE DEFAULT null,
          localizacao VARCHAR(255) DEFAULT null,
          
          data_de_sepultamento DATE DEFAULT null,
          legalizado INT DEFAULT 0,
          adiar INT DEFAULT NULL,
          agendado  INT DEFAULT 0,
          nacionalidade VARCHAR(255) DEFAULT null,
          numero_do_acento_do_obito VARCHAR(45) DEFAULT null,
          parentesco VARCHAR(255) DEFAULT null, 
          genero VARCHAR(255) DEFAULT null,
          id_sepultura INT DEFAULT null,
          rupe TEXT DEFAULT null 
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`,
    
      `CREATE TABLE IF NOT EXISTS sepulturas (
          id_sepultura INT AUTO_INCREMENT PRIMARY KEY,
          quadra VARCHAR(45) DEFAULT NULL,
          numero_de_lote INT DEFAULT  0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`,
    
      `CREATE TABLE IF NOT EXISTS notificacoes (
          id_notificacao INT AUTO_INCREMENT PRIMARY KEY,
          descricao VARCHAR(45) DEFAULT NULL,
          data_da_notificacao DATETIME DEFAULT current_timestamp(),
          id_usuario INT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`
    ];

    async function  adm(connection){
      
       
      const senhaEncriptada = await bcrypt.hashSync(admCredenciais.senha, salt);
      const accessToken = jwt.sign({usuarioTipo: 0,usuarioEmail:admCredenciais.email,senha:senhaEncriptada}, secretKey.secretKey);
      // Criar uma conexão com o banco de dados
      const tipo='0'
      const selectQuery = 'SELECT * FROM usuarios WHERE tipo = 0';
      const insertQuery = 'INSERT INTO usuarios (email, senha,token,tipo) VALUES (?,?,?,?)';
  
      connection.query(selectQuery, (err, results) => {
          if (err) {
              console.error('Erro ao excluir usuário:', err.message);
              return;
          } 
      
          if(results.length==0){
            connection.query(insertQuery, [admCredenciais.email, senhaEncriptada,accessToken,0], (err, results) => {
              if (err) {
                  console.error('Erro ao inserir usuário:', err);
                  return;
              }
                                                     
              console.log('Adm atualizado com sucesso.');
          });
          }else{
 
              
 
            const updateQuery = 'UPDATE usuarios SET token = ?,email = ?,senha = ? WHERE tipo = 0';

            // Parâmetros para a consulta SQL
            const params = [accessToken,admCredenciais.email,senhaEncriptada];
        
            // Executar a consulta SQL
            connection.query(updateQuery, params, (err, result) => {
                if (err) {
                    console.error('Erro ao atualizar usuário:', err);
                    
                }

               console.log("Administrador actualizado com sucesso")
             
            });
            
          }
          
      });
  
  
  }
   
  const connection3 = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
  });
  connection3.changeUser({ database: dbConfig.database });
    // Verificar se cada tabela existe e criar somente as que não existem
    for (const query of createTableQueries) {
      const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\S+)/)[1];
      const tableExists = await checkIfTableExists(connection3, tableName);
      if (!tableExists) {
        await runQuery(connection, query);
        
      } else {
       
      }
    }
    const connection2 = mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    connection2.changeUser({ database: dbConfig.database });
    adm(connection2)
    console.log('Processo de criação de tabelas concluído.');
  } catch (error) { 
  console.log(error)
  } finally {
    // Fechar a conexão com o servidor MySQL
    connection.end();
  }
});

module.exports=connection
