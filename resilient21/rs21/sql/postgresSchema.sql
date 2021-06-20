CREATE TABLE address(
    addressId SERIAL PRIMARY KEY,
    addressCity VARCHAR(128) NOT NULL,
    addressCountry VARCHAR(128) NOT NULL,
    addressLine1 VARCHAR(128) NOT NULL,
    addressLine2 VARCHAR(128),
    addressState CHAR(2) NOT NULL,
    addressZip VARCHAR(10) NOT NULL
);

CREATE TABLE job(
    jobId SERIAL PRIMARY KEY,

    jobTitle VARCHAR(128) NOT NULL,
    jobIsOpen BOOLEAN NOT NULL
);

CREATE TABLE users(
    userId SERIAL PRIMARY KEY,
    userAddressId INT NOT NULL,
    userEmail VARCHAR(64) NOT NULL,
    userJobId INT NOT NULL,
    userNameFirst VARCHAR(64) NOT NULL,
    userNameMiddle VARCHAR(64),
    userNameLast VARCHAR(64) NOT NULL,
    userPhone VARCHAR(20) NOT NULL,
    userPwd CHAR(64) NOT NULL,

    FOREIGN KEY(userAddressId) REFERENCES address(addressId)
);

CREATE TABLE application(
    appId SERIAL PRIMARY KEY,

    appNameFirst VARCHAR(64) NOT NULL,
    appNameMiddle VARCHAR(64),
    appNameLast VARCHAR(64) NOT NULL,
    appDate TIMESTAMP NOT NULL,
    appAddressId INT NOT NULL,
    appPhone VARCHAR(20) NOT NULL,
    appEmail VARCHAR(64) NOT NULL,
    appDateAvailable TIMESTAMP NOT NULL,
    appDesiredSalary INT NOT NULL,
    appJobTitle VARCHAR(128) NOT NULL,
    appHearAbout VARCHAR(2048),
    appAuthorizedInUS BOOLEAN NOT NULL,
    appSecurityClearance BOOLEAN NOT NULL,
    appVeteran BOOLEAN NOT NULL,
    appFelonReason VARCHAR(2048),
    FOREIGN KEY(appAddressId) REFERENCES address(addressId)
);

CREATE TABLE reference(
    refId SERIAL PRIMARY KEY,

    refAppId INT NOT NULL,

    refEmail VARCHAR(64) NOT NULL,
    refCompany VARCHAR(128) NOT NULL,
    refName VARCHAR(128) NOT NULL,
    refPhone VARCHAR(20) NOT NULL,
    refRelationship VARCHAR(128) NOT NULL,

    FOREIGN KEY(refAppId) REFERENCES application(appId)
);

CREATE TABLE previousEmployment(
    peId SERIAL PRIMARY KEY,

    peAppId INT NOT NULL,

    peAddressId INT,
    peCompany VARCHAR(128) NOT NULL,
    peDateStart TIMESTAMP NOT NULL,
    peDateEnd TIMESTAMP NOT NULL,
    peMayContact BOOLEAN NOT NULL,
    pePhone VARCHAR(20) NOT NULL,
    peResponsibilities VARCHAR(2048) NOT NULL,
    peReasonForLeaving VARCHAR(2048) NOT NULL,
    peSalaryStart INT NOT NULL,
    peSalaryEnd INT NOT NULL,
    peSupervisor VARCHAR(128) NOT NULL,
    peJobTitle VARCHAR(64) NOT NULL,

    FOREIGN KEY(peAddressId) REFERENCES address(addressId),
    FOREIGN KEY(peAppId) REFERENCES application(appId)
);

CREATE TABLE link(
    linkId SERIAL PRIMARY KEY,
    linkAppId INT NOT NULL,
    linkURL VARCHAR(256),

    FOREIGN KEY(linkAppId) REFERENCES application(appId)
);

CREATE TABLE education(
    edId SERIAL PRIMARY KEY,
    edAppId INT NOT NULL,
    edName VARCHAR(128) NOT NULL,
    edDateStart TIMESTAMP NOT NULL,
    edDateEnd TIMESTAMP NOT NULL,
    edGrad BOOLEAN NOT NULL,
    edDegree VARCHAR(128),

    FOREIGN KEY(edAppId) REFERENCES application(appId)
);

CREATE TABLE newhire(
    nhid SERIAL PRIMARY KEY,
    nhname VARCHAR(64) NOT NULL,
    nhpwd VARCHAR(128) NOT NULL
);

INSERT INTO newhire(nhname, nhpwd) VALUES('newhire', '');
