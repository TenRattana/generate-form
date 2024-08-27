-- Create Table MachineGroups
```sql CREATE TABLE MachineGroups (
    MGroupID VARCHAR(10) PRIMARY KEY,
    GroupName VARCHAR(255),
    Description TEXT,
    DisplayOrder INT
);
```
```sql CREATE TABLE Machines (
    MachineID VARCHAR(10) PRIMARY KEY,
    MGroupID VARCHAR(10),
    MachineName VARCHAR(255),
    Description TEXT,
    DisplayOrder INT,
    FOREIGN KEY (MGroupID) REFERENCES MachineGroups(MGroupID)
);
```
```sql CREATE TABLE ListTypes (
    TypeID VARCHAR(10) PRIMARY KEY,
    TypeName VARCHAR(50)
);
```
```sql CREATE TABLE DataType (
    DTypeID VARCHAR(10) PRIMARY KEY,
    DTypeName VARCHAR(50)
);
```
CREATE TABLE Lists (
    ListID VARCHAR(10) PRIMARY KEY,
    ListName VARCHAR(255)
);

CREATE TABLE ListDetails (
    LDetailID VARCHAR(10) PRIMARY KEY,
    LDetailName VARCHAR(255)
);
```
```sql CREATE TABLE Cards (
    CardID VARCHAR(10) PRIMARY KEY,
    CardName VARCHAR(50),
    Columns TINYINT,
    DisplayOrder TINYINT
);
```
```sql CREATE TABLE Forms (
    FormID VARCHAR(10) PRIMARY KEY,
    FormName VARCHAR(50),
    DisplayOrder TINYINT
);
```
```sql CREATE TABLE MatchListDetail (
    ID INT PRIMARY KEY,
    MLDetailID VARCHAR(10),
    ListID VARCHAR(10),
    LDetailID VARCHAR(10),
    Description TEXT,
    DisplayOrder INT,
    FOREIGN KEY (ListID) REFERENCES Lists(ListID),
    FOREIGN KEY (LDetailID) REFERENCES ListDetails(LDetailID)
);
```
```sql CREATE TABLE MatchList (
    MListID VARCHAR(10) PRIMARY KEY,
    ListID VARCHAR(10),
    MLDetailID VARCHAR(10),
    TypeID VARCHAR(10),
    DTypeID VARCHAR(10),
    CardID VARCHAR(10),
    DisplayOrder INT,
    FOREIGN KEY (ListID) REFERENCES Lists(ListID),
    FOREIGN KEY (MLDetailID) REFERENCES MatchListDetail(MLDetailID),
    FOREIGN KEY (TypeID) REFERENCES ListTypes(TypeID),
    FOREIGN KEY (DTypeID) REFERENCES DataType(DTypeID),
    FOREIGN KEY (CardID) REFERENCES Cards(CardID)
);
```
```sql CREATE TABLE Rules (
    RuleID VARCHAR(10) PRIMARY KEY,
    RuleName VARCHAR(50),
    RuleValue VARCHAR(50)
);
```
```sql CREATE TABLE MatchRule (
    MValidationID VARCHAR(10) PRIMARY KEY,
    MListID VARCHAR(10),
    RuleID VARCHAR(10),
    Description TEXT,
    DisplayOrder INT,
    FOREIGN KEY (MListID) REFERENCES MatchList(MListID),
    FOREIGN KEY (RuleID) REFERENCES Rules(RuleID)
);
```
```sql CREATE TABLE MatchForm (
    MFormID VARCHAR(10) PRIMARY KEY,
    MachineID VARCHAR(50),
    CardID VARCHAR(10),
    FormID VARCHAR(10),
    FOREIGN KEY (MachineID) REFERENCES Machines(MachineID),
    FOREIGN KEY (CardID) REFERENCES Cards(CardID),
    FOREIGN KEY (FormID) REFERENCES Forms(FormID)
);
```
```sql CREATE TABLE ExpectedResults (
    ExpectedResultID VARCHAR(10) PRIMARY KEY,
    MFormID VARCHAR(10),
    MListID VARCHAR(10),
    TableID VARCHAR(50),
    ExpectedResult TEXT,
    CreateDate DATE,
    FOREIGN KEY (MFormID) REFERENCES MatchForm(MFormID),
    FOREIGN KEY (MListID) REFERENCES MatchList(MListID)
);
```
```sql
INSERT INTO MachineGroups (MGroupID, GroupName, Description, DisplayOrder) VALUES
('MG01', 'Group 1', 'Description for Group 1', 1),
('MG02', 'Group 2', 'Description for Group 2', 2);

INSERT INTO Machines (MachineID, MGroupID, MachineName, Description, DisplayOrder) VALUES
('M01', 'MG01', 'Machine 1', 'Description for Machine 1', 1),
('M02', 'MG01', 'Machine 2', 'Description for Machine 2', 2),
('M03', 'MG02', 'Machine 3', 'Description for Machine 3', 1);

INSERT INTO ListTypes (TypeID, TypeName) VALUES
('T01', 'Type 1'),
('T02', 'Type 2');

INSERT INTO DataType (DTypeID, DTypeName) VALUES
('DT01', 'Data Type 1'),
('DT02', 'Data Type 2');

INSERT INTO Lists (ListID, ListName) VALUES
('L01', 'List 1'),
('L02', 'List 2');

INSERT INTO ListDetails (LDetailID, LDetailName) VALUES
('LD01', 'List Detail 1'),
('LD02', 'List Detail 2');

INSERT INTO Cards (CardID, CardName, Columns, DisplayOrder) VALUES
('C01', 'Card 1', 3, 1),
('C02', 'Card 2', 2, 2);

INSERT INTO Forms (FormID, FormName, DisplayOrder) VALUES
('F01', 'Form 1', 1),
('F02', 'Form 2', 2);

INSERT INTO MatchListDetail (ID, MLDetailID, ListID, LDetailID, Description, DisplayOrder) VALUES
(1, 'MLD01', 'L01', 'LD01', 'Detail for List 1', 1),
(2, 'MLD02', 'L02', 'LD02', 'Detail for List 2', 2);

INSERT INTO MatchList (MListID, ListID, MLDetailID, TypeID, DTypeID, CardID, DisplayOrder) VALUES
('ML01', 'L01', 'MLD01', 'T01', 'DT01', 'C01', 1),
('ML02', 'L02', 'MLD02', 'T02', 'DT02', 'C02', 2);

INSERT INTO Rules (RuleID, RuleName, RuleValue) VALUES
('R01', 'Rule 1', 'Value 1'),
('R02', 'Rule 2', 'Value 2');

INSERT INTO MatchRule (MValidationID, MListID, RuleID, Description, DisplayOrder) VALUES
('MR01', 'ML01', 'R01', 'Validation Rule 1', 1),
('MR02', 'ML02', 'R02', 'Validation Rule 2', 2);

INSERT INTO MatchForm (MFormID, MachineID, CardID, FormID) VALUES
('MF01', 'M01', 'C01', 'F01'),
('MF02', 'M02', 'C02', 'F02');

INSERT INTO ExpectedResults (ExpectedResultID, MFormID, MListID, TableID, ExpectedResult, CreateDate) VALUES
('ER01', 'MF01', 'ML01', 'T01', 'Expected Result 1', '2024-08-27'),
('ER02', 'MF02', 'ML02', 'T02', 'Expected Result 2', '2024-08-27');
```
