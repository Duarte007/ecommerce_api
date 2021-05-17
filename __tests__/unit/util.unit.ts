import Util from "../../src/util";

describe("Util tests beginning...", (): void => {
  afterAll((): void => {
    console.log("Finished util tests...");
  });

  it("should receive a string and then format as CPF", (): void => {
    const response = Util.formatCpf("19923335598");
    expect(response).toHaveLength(14);
  });

  it("should receive a string and then format as CNPJ", (): void => {
    const response = Util.formatCnpj("49046824000191");
    expect(response).toHaveLength(18);
  });

  it("must receive a valid CPF and validate it", (): void => {
    let response = Util.validateCpfCnpj("07770096090");
    expect(response).toBe(true);
  });

  it("must receive a valid CNPJ and validate it", (): void => {
    let response = Util.validateCpfCnpj("96722088000124");
    expect(response).toBe(true);
  });

  it("must receive a invalid CPF and validate it", (): void => {
    let response = Util.validateCpfCnpj("15498457742");
    expect(response).toBe(false);
  });

  it("must receive a invalid CNPJ and validate it", (): void => {
    let response = Util.validateCpfCnpj("97721088000164");
    expect(response).toBe(false);
  });

  it("should remove all special chars of a string", (): void => {
    let response = Util.removeSpecialChars("É ÁÇÉÓṔ ÑÃÔ ÉÓì");
    expect(response).toBe("E ACEOP NAO EOi");
    response = Util.removeSpecialChars("ÁÈṔÃÑ");
    expect(response).toBe("AEPAN");
  });

  it("should return the same input value if is empty", (): void => {
    let response = Util.removeSpecialChars("");
    expect(response).toHaveLength(0);
  });

  it("should return true if the cpf is valid", (): void => {
    let response = Util.validateCpf("70622620053");
    expect(response).toBeTruthy();
    response = Util.validateCpf("12345678999");
    expect(response).toBeFalsy();
  });

  it("should return true if the cnpj is valid", (): void => {
    let response = Util.validateCnpj("40841711000103");
    expect(response).toBeTruthy();
    response = Util.validateCnpj("13945752101023");
    expect(response).toBeFalsy();
  });
});
