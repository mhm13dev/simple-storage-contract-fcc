import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

describe("SimpleStorage", function () {
  let simpleStorageFactory: SimpleStorage__factory;
  let simpleStorage: SimpleStorage;

  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should start with a favorite number of 0", async function () {
    const currenValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    // expect(currenValue).to.equal(expectedValue);
    assert.equal(currenValue.toString(), expectedValue);
  });

  it("Should update when we call store", async function () {
    const expectedValue = "42";
    const trxRes = await simpleStorage.store(expectedValue);
    await trxRes.wait(1);

    const currenValue = await simpleStorage.retrieve();
    // expect(currenValue).to.equal(expectedValue);
    assert.equal(currenValue.toString(), expectedValue);
  });
});
