Create Table
```sql

-- Table: CheckListTypes
CREATE TABLE CheckListTypes (
    CTypeID VARCHAR(10) PRIMARY KEY,
    CTypeName VARCHAR(50) NOT NULL
);

-- Table: DataTypes
CREATE TABLE DataTypes (
    DTypeID VARCHAR(10) PRIMARY KEY,
    DTypeName VARCHAR(50) NOT NULL
);

-- Table: CheckLists
CREATE TABLE CheckLists (
    CListID VARCHAR(10) PRIMARY KEY,
    CListName VARCHAR(255) NOT NULL
);

-- Table: CheckListOptions
CREATE TABLE CheckListOptions (
    CLOptionID VARCHAR(10) PRIMARY KEY,
    CLOptionName VARCHAR(255) NOT NULL
);

-- Table: Forms
CREATE TABLE Forms (
    FormID VARCHAR(10) PRIMARY KEY,
    FormName VARCHAR(50) NOT NULL,
    Description VARCHAR(255),
    IsActive BIT NOT NULL
);

-- Table: SubForms
CREATE TABLE SubForms (
    SFormID VARCHAR(10) PRIMARY KEY,
    FormID VARCHAR(10),
    SFormName VARCHAR(50) NOT NULL,
    Columns TINYINT NOT NULL,
    DisplayOrder TINYINT NOT NULL,
    FOREIGN KEY (FormID) REFERENCES Forms(FormID)
);

-- Table: MatchCheckList
CREATE TABLE MatchCheckList (
    MCListID int PRIMARY KEY IDENTITY,
    CListID VARCHAR(10),
    CLOptionID VARCHAR(10),
    CTypeID VARCHAR(10),
    DTypeID VARCHAR(10),
    DTypeValue VARCHAR(10),
    SFormID VARCHAR(10),
    Required BIT NOT NULL,
    MinLength TINYINT,
    MaxLength TINYINT,
    Placeholder VARCHAR(50),
    Hint VARCHAR(50),
    DisplayOrder TINYINT NOT NULL,
    FOREIGN KEY (CListID) REFERENCES CheckLists(CListID),
    FOREIGN KEY (CLOptionID) REFERENCES CheckListOptions(CLOptionID),
    FOREIGN KEY (CTypeID) REFERENCES CheckListTypes(CTypeID),
    FOREIGN KEY (DTypeID) REFERENCES DataTypes(DTypeID),
    FOREIGN KEY (SFormID) REFERENCES SubForms(SFormID)
);

-- Table: MachineGroups
CREATE TABLE MachineGroups (
    MGroupID VARCHAR(10) PRIMARY KEY,
    MGroupName VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    DisplayOrder TINYINT NOT NULL
);

-- Table: Machines
CREATE TABLE Machines (
    MachineID VARCHAR(10) PRIMARY KEY,
    FormID VARCHAR(10),
    MGroupID VARCHAR(10),
    MachineName VARCHAR(255) NOT NULL,
    Description VARCHAR(255),
    DisplayOrder TINYINT NOT NULL,
    FOREIGN KEY (FormID) REFERENCES Forms(FormID),
    FOREIGN KEY (MGroupID) REFERENCES MachineGroups(MGroupID)
);

-- Table: ExpectedResults
CREATE TABLE ExpectedResults (
    EResultID VARCHAR(10) PRIMARY KEY,
    MListID int,
    FormID VARCHAR(10),
    MachineID VARCHAR(10),
    TableID VARCHAR(50),
    EResult VARCHAR(255),
    CreateDate DATE NOT NULL,
    FOREIGN KEY (MListID) REFERENCES MatchCheckList(MCListID),
    FOREIGN KEY (FormID) REFERENCES Forms(FormID),
    FOREIGN KEY (MachineID) REFERENCES Machines(MachineID)
);
```

Insert 
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
