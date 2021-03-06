-- Third level
DROP TABLE IF EXISTS DOOR_CONTROL;
DROP TABLE IF EXISTS DOOR_OPEN;
DROP TABLE IF EXISTS DOOR_CLOSED;

-- Second level
DROP TABLE IF EXISTS TAG;

-- First level
DROP TABLE IF EXISTS DOOR;
DROP TABLE IF EXISTS USER;
DROP TABLE IF EXISTS ADMIN;

DROP TRIGGER IF EXISTS delete_door_control_from_door;
DROP TRIGGER IF EXISTS delete_door_control_from_tag;
DROP TRIGGER IF EXISTS close_the_door;
DROP TRIGGER IF EXISTS create_door_closed_from_door_insert;
DROP TRIGGER IF EXISTS delete_tag_from_user;


-- --------------------------------------------
--
-- FIRST LEVEL CREATION
--
-- --------------------------------------------
CREATE TABLE USER (
  ID_USER INT NOT NULL AUTO_INCREMENT,
  URL CHAR(15) NOT NULL,
  FIRST_NAME CHAR(40) NOT NULL,
  LAST_NAME CHAR(40) NOT NULL,
  EMAIL CHAR(50) NOT NULL,

  CONSTRAINT PK_ID_USER PRIMARY KEY(ID_USER)
);

CREATE TABLE DOOR (
  ID_DOOR INT NOT NULL AUTO_INCREMENT,
  ID_DOOR_ENCRYPTED CHAR(15) NOT NULL,
  CREATION_DATE DATE NOT NULL,
  CREATION_TIME TIME NOT NULL,
  NAME CHAR(40),
  STATE CHAR(6) NOT NULL DEFAULT "closed",

  CONSTRAINT PK_ID_DOOR PRIMARY KEY(ID_DOOR)
);

CREATE TABLE ADMIN (
  ID_ADMIN INT NOT NULL AUTO_INCREMENT,
  LOGIN CHAR(40) NOT NULL,
  PASSWORD CHAR(60) NOT NULL,
  PICTURE LONGTEXT NOT NULL,

  CONSTRAINT PK_ID_ADMIN PRIMARY KEY(ID_ADMIN)
);

-- --------------------------------------------
--
-- SECOND LEVEL CREATION
--
-- --------------------------------------------

CREATE TABLE TAG (
  ID_TAG INT NOT NULL AUTO_INCREMENT,
  ID_TAG_ENCRYPTED CHAR(15) NOT NULL,
  CREATION_DATE DATE NOT NULL,
  CREATION_TIME TIME NOT NULL,
  NAME CHAR(40) NOT NULL,
  ID_USER INT NOT NULL,

  CONSTRAINT PK_ID_TAG PRIMARY KEY(ID_TAG),
  CONSTRAINT FK_ID_USER_FOR_TAG FOREIGN KEY(ID_USER) REFERENCES USER(ID_USER)
);

-- --------------------------------------------
--
-- THIRD LEVEL CREATION
--
-- --------------------------------------------
CREATE TABLE DOOR_CONTROL (
  ID_DOOR_CONTROL INT NOT NULL AUTO_INCREMENT,
  ID_DOOR INT NOT NULL,
  ID_TAG INT NOT NULL,
  CREATION_DATE DATE NOT NULL,
  CREATION_TIME TIME NOT NULL,

  CONSTRAINT PK_ID_DOOR_CONTROL PRIMARY KEY(ID_DOOR_CONTROL),
  CONSTRAINT FK_ID_DOOR_FOR_DOOR_CONTROL FOREIGN KEY(ID_DOOR) REFERENCES DOOR(ID_DOOR),
  CONSTRAINT FK_ID_TAG_FOR_DOOR_CONTROL FOREIGN KEY(ID_TAG) REFERENCES TAG(ID_TAG)
);

CREATE TABLE DOOR_CLOSED (
  ID_DOOR_CLOSED INT NOT NULL AUTO_INCREMENT,
  ID_DOOR INT NOT NULL,
  EVENT_DATE DATE NOT NULL,
  EVENT_TIME TIME NOT NULL,

  CONSTRAINT PK_ID_DOOR_CLOSED PRIMARY KEY(ID_DOOR_CLOSED)
);

CREATE TABLE DOOR_OPEN (
  ID_DOOR_OPEN INT NOT NULL AUTO_INCREMENT,
  ID_DOOR INT NOT NULL,
  ID_TAG INT NOT NULL,
  EVENT_DATE DATE NOT NULL,
  EVENT_TIME TIME NOT NULL,

  CONSTRAINT PK_ID_DOOR_OPENED PRIMARY KEY(ID_DOOR_OPEN)
);
INSERT INTO ADMIN (LOGIN, PASSWORD, PICTURE) VALUES ("projetoc", "$2b$15$qpvxd2ojxhcpO8gR1mBTRuZN5XFJ894nbTwbV32NzBLdlVQTeUPv6", "/public/images/admin.jpg");

INSERT INTO USER (URL, FIRST_NAME, LAST_NAME, EMAIL) VALUES ("8M9ZwnneIxIpuX3", "Simon", "Gautrey", "simon.gautrey@reseau.eseo.fr");
INSERT INTO USER (URL, FIRST_NAME, LAST_NAME, EMAIL) VALUES ("R2K7WveGwzEL4lR", "Paul-François", "Gapais", "paul-francois.gapais@reseau.eseo.fr");
INSERT INTO USER (URL, FIRST_NAME, LAST_NAME, EMAIL) VALUES ("zYDtnZEiqrKVc6Q", "Martin", "Dauton", "martin.dauton@reseau.eseo.fr");
INSERT INTO USER (URL, FIRST_NAME, LAST_NAME, EMAIL) VALUES ("QWiUmG55L7fvqbW", "Amélie", "Lens", "amelie.lens@reseau.eseo.fr");
INSERT INTO USER (URL, FIRST_NAME, LAST_NAME, EMAIL) VALUES ("dvsEUQuFu5euw8n", "Deborah", "de Luca", "deborah.deluca@reseau.eseo.fr");
INSERT INTO USER (URL, FIRST_NAME, LAST_NAME, EMAIL) VALUES ("y5eI8gGQgx5zIvb", "Charlotte", "de Witte", "charlotte.dewitte@reseau.eseo.fr");

INSERT INTO TAG (ID_TAG_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME, ID_USER) VALUES ("rKil43hjDKCTBfm", CURDATE(), CURTIME(), "premier tag de simon", 1);
INSERT INTO TAG (ID_TAG_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME, ID_USER) VALUES ("iJTWEa8xRDPcPW4", CURDATE(), CURTIME(), "deuxieme tag de simon", 1);
INSERT INTO TAG (ID_TAG_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME, ID_USER) VALUES ("VxZppkaRg3fZthS", CURDATE(), CURTIME(), "premier tag de paul francois", 2);
INSERT INTO TAG (ID_TAG_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME, ID_USER) VALUES ("qjF2TiFDL1SBWTJ", CURDATE(), CURTIME(), "premier et seul tag de Martin", 3);

DELIMITER |
  CREATE TRIGGER create_door_closed_from_door_insert AFTER INSERT
  ON DOOR FOR EACH ROW
  BEGIN
    INSERT INTO DOOR_CLOSED(ID_DOOR, EVENT_DATE, EVENT_TIME) VALUES (NEW.ID_DOOR, CURDATE(), CURTIME());
  END |
DELIMITER ;

INSERT INTO DOOR (ID_DOOR_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME) VALUES ("s56F9oe4xCv2jkA", CURDATE(), CURTIME(), "la porte au fond a gauche du couloir");
INSERT INTO DOOR (ID_DOOR_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME) VALUES ("35eVhG9AskabNR3", CURDATE(), CURTIME(), "la porte qui ouvre les toilettes");
INSERT INTO DOOR (ID_DOOR_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME) VALUES ("mnLslKS3aFVraVS", CURDATE(), CURTIME(), "la porte qui mène nul part");
INSERT INTO DOOR (ID_DOOR_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME) VALUES ("lm59dsaMFEpqrA4", CURDATE(), CURTIME(), "la porte des enfers");
INSERT INTO DOOR (ID_DOOR_ENCRYPTED, CREATION_DATE, CREATION_TIME, NAME) VALUES ("gl4zak16gGrdlRT", CURDATE(), CURTIME(), "ma porte de chambre");

INSERT INTO DOOR_CONTROL (ID_DOOR, ID_TAG, CREATION_DATE, CREATION_TIME) VALUES (1, 1, CURDATE(), CURTIME());
INSERT INTO DOOR_CONTROL (ID_DOOR, ID_TAG, CREATION_DATE, CREATION_TIME) VALUES (2, 1, CURDATE(), CURTIME());
INSERT INTO DOOR_CONTROL (ID_DOOR, ID_TAG, CREATION_DATE, CREATION_TIME) VALUES (3, 1, CURDATE(), CURTIME());
INSERT INTO DOOR_CONTROL (ID_DOOR, ID_TAG, CREATION_DATE, CREATION_TIME) VALUES (1, 2, CURDATE(), CURTIME());
INSERT INTO DOOR_CONTROL (ID_DOOR, ID_TAG, CREATION_DATE, CREATION_TIME) VALUES (2, 3, CURDATE(), CURTIME());

DELIMITER |

CREATE TRIGGER delete_door_control_from_door BEFORE DELETE
  ON DOOR FOR EACH ROW
  BEGIN
    DELETE FROM DOOR_CONTROL WHERE DOOR_CONTROL.ID_DOOR = OLD.ID_DOOR;
  END |

CREATE TRIGGER delete_door_control_from_tag BEFORE DELETE
  ON TAG FOR EACH ROW
  BEGIN
    DELETE FROM DOOR_CONTROL WHERE DOOR_CONTROL.ID_TAG = OLD.ID_TAG;
  END |

CREATE TRIGGER delete_tag_from_user BEFORE DELETE
  ON USER FOR EACH ROW
  BEGIN
    DELETE FROM TAG WHERE TAG.ID_USER = OLD.ID_USER;
  END |

CREATE TRIGGER close_the_door AFTER UPDATE
  ON DOOR FOR EACH ROW
  BEGIN
    IF NEW.STATE = "closed" THEN
      INSERT INTO DOOR_CLOSED(ID_DOOR, EVENT_DATE, EVENT_TIME) VALUES (NEW.ID_DOOR, CURDATE(), CURTIME());
    END IF;
  END |

DELIMITER ;
