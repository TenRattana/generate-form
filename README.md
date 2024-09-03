### Create Table
```sql

-- Table: CheckListTypes
CREATE TABLE CheckListTypes (
    CTypeID NCHAR(5) PRIMARY KEY,
    CTypeName NVARCHAR(150) NOT NULL
);

-- Table: DataTypes
CREATE TABLE DataTypes (
    DTypeID NCHAR(5) PRIMARY KEY,
    DTypeName NVARCHAR(150) NOT NULL
);

-- Table: CheckLists
CREATE TABLE CheckLists (
    CListID NCHAR(5) PRIMARY KEY,
    CListName NVARCHAR(255) NOT NULL
);

-- Table: CheckListOptions
CREATE TABLE CheckListOptions (
    CLOptionID NCHAR(6) PRIMARY KEY,
    CLOptionName NVARCHAR(255) NOT NULL
);

-- Table: Forms
CREATE TABLE Forms (
    FormID NCHAR(5) PRIMARY KEY,
    FormName NVARCHAR(150) NOT NULL,
    Description NVARCHAR(255),
    IsActive BIT NOT NULL
);

-- Table: SubForms
CREATE TABLE SubForms (
    SFormID NCHAR(6) PRIMARY KEY,
    FormID NCHAR(5),
    SFormName NVARCHAR(150) NOT NULL,
    Columns TINYINT NOT NULL,
    DisplayOrder TINYINT NOT NULL,
    FOREIGN KEY (FormID) REFERENCES Forms(FormID)
);

-- Table: MatchCheckList
CREATE TABLE MatchCheckList (
    MCListID INT PRIMARY KEY IDENTITY,
    CListID NCHAR(5),
    CLOptionID NCHAR(6),
    CTypeID NCHAR(5),
    DTypeID NCHAR(5),
    DTypeValue tinyINT,
    SFormID NCHAR(6),
    Required BIT NOT NULL,
    MinLength TINYINT,
    MaxLength TINYINT,
    Placeholder NVARCHAR(150),
    HINT NVARCHAR(150),
    DisplayOrder TINYINT NOT NULL,
    FOREIGN KEY (CListID) REFERENCES CheckLists(CListID),
    FOREIGN KEY (CLOptionID) REFERENCES CheckListOptions(CLOptionID),
    FOREIGN KEY (CTypeID) REFERENCES CheckListTypes(CTypeID),
    FOREIGN KEY (DTypeID) REFERENCES DataTypes(DTypeID),
    FOREIGN KEY (SFormID) REFERENCES SubForms(SFormID)
);

-- Table: MachineGroups
CREATE TABLE MachineGroups (
    MGroupID NCHAR(5) PRIMARY KEY,
    MGroupName NVARCHAR(150) NOT NULL,
    Description NVARCHAR(255),
    DisplayOrder TINYINT NOT NULL
);

-- Table: Machines
CREATE TABLE Machines (
    MachineID NCHAR(4) PRIMARY KEY,
    FormID NCHAR(5),
    MGroupID NCHAR(5),
    MachineName NVARCHAR(150) NOT NULL,
    Description NVARCHAR(255),
    DisplayOrder TINYINT NOT NULL,
    FOREIGN KEY (FormID) REFERENCES Forms(FormID),
    FOREIGN KEY (MGroupID) REFERENCES MachineGroups(MGroupID)
);

-- Table: ExpectedResults
CREATE TABLE ExpectedResults (
    EResultID INT PRIMARY KEY IDENTITY,
    MListID INT,
    FormID NCHAR(5),
    MachineID NCHAR(4),
    TableID NCHAR(10),
    EResult NVARCHAR(255),
    CreateDate DATETIME NOT NULL,
    FOREIGN KEY (MListID) REFERENCES MatchCheckList(MCListID),
    FOREIGN KEY (FormID) REFERENCES Forms(FormID),
    FOREIGN KEY (MachineID) REFERENCES Machines(MachineID)
);
```

### Insert 
```sql
-- Insert into CheckListTypes
INSERT INTO CheckListTypes (CTypeID, CTypeName) VALUES
('CT001', 'Textinput'),
('CT002', 'Textaera'),
('CT003', 'Dropdown'),
('CT004', 'Radio'),
('CT005', 'Checkbox');

-- Insert into DataTypes
INSERT INTO DataTypes (DTypeID, DTypeName) VALUES
('DT001', 'String'),
('DT002', 'Integer'),
('DT003', 'Float');

-- Insert into CheckLists
INSERT INTO CheckLists (CListID, CListName) VALUES
('CL001', 'CheckList1'),
('CL002', 'CheckList2');

-- Insert into CheckListOptions
INSERT INTO CheckListOptions (CLOptionID, CLOptionName) VALUES
('CO001', 'Option1'),
('CO002', 'Option2');

-- Insert into Forms
INSERT INTO Forms (FormID, FormName, Description, IsActive) VALUES
('F001', 'Form1', 'Description for Form1', 1),
('F002', 'Form2', 'Description for Form2', 1);

-- Insert into SubForms
INSERT INTO SubForms (SFormID, FormID, SFormName, Columns, DisplayOrder) VALUES
('SF001', 'F001', 'SubForm1', 3, 1),
('SF002', 'F002', 'SubForm2', 2, 2);

-- Insert into MatchCheckList
INSERT INTO MatchCheckList ( CListID, CLOptionID, CTypeID, DTypeID, DTypeValue, SFormID, Required, MinLength, MaxLength, Placeholder, Hint, DisplayOrder) VALUES
( 'CL001', 'CO001', 'CT001', 'DT001', 'Value1', 'SF001', 1, 1, 10, 'Placeholder1', 'Hint1', 1),
( 'CL002', 'CO002', 'CT002', 'DT002', 'Value2', 'SF002', 0, 2, 20, 'Placeholder2', 'Hint2', 2);

-- Insert into MachineGroups
INSERT INTO MachineGroups (MGroupID, MGroupName, Description, DisplayOrder) VALUES
('MG001', 'Group1', 'Description for Group1', 1),
('MG002', 'Group2', 'Description for Group2', 2);

-- Insert into Machines
INSERT INTO Machines (MachineID, FormID, MGroupID, MachineName, Description, DisplayOrder) VALUES
('M001', 'F001', 'MG001', 'Machine1', 'Description for Machine1', 1),
('M002', 'F002', 'MG002', 'Machine2', 'Description for Machine2', 2);

-- Insert into ExpectedResults
INSERT INTO ExpectedResults (EResultID, MCListID, FormID, MachineID, TableID, EResult, CreateDate) VALUES
('ER001', 1, 'F001', 'M001', 'Table1', 'Result1', '2024-09-01'),
('ER002', 2, 'F002', 'M002', 'Table2', 'Result2', '2024-09-02');
```
