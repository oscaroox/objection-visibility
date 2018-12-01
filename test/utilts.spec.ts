import { expect } from "chai";
import * as utils from "../src/utils";

describe("utils", () => {

    const data = {
        firstName: "johnn",
        lastName: "Doe",
        password: "testing123",
        email: "johndoe@example.com",
    };

    it("should pick certain keys from an object", () => {
        const newData = utils.pick(data, ["firstName", "lastName"]);

        expect(newData).to.have.property("firstName");
        expect(newData).to.have.property("lastName");
        expect(newData).to.not.have.property("password");
        expect(newData).to.not.have.property("email");
    });

    it("should omit certain keys from an object", () => {
        const newData = utils.omit(data, ["firstName", "lastName", "password"]);

        expect(newData).to.have.property("email");
        expect(newData).to.not.have.property("firstName");
        expect(newData).to.not.have.property("lastName");
        expect(newData).to.not.have.property("password");
    });
});
