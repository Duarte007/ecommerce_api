class Util {
  public isEmptyField = (field: number | string | []): boolean => {
    if (field == null || field === "" || field == 0 || field == []) return true;
    return false;
  };

  public formatCnpj = (text: string): string => {
    return text.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
  };

  public formatCpf = (text: string): string => {
    return text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  };

  public validateCpfCnpj = (code: string): boolean => {
    const cpf = code
      .toString()
      .split(/[.\/-]/)
      .join("");

    if (cpf.length == 11) {
      return this.validateCpf(cpf);
    }
    if (cpf.length == 14) {
      return this.validateCnpj(cpf);
    }

    return false;
  };

  public validateCpf(cpf: string) {
    let Resto,
      Soma = 0,
      i;

    if (cpf == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(cpf.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  public validateCnpj(s: string) {
    const cnpj = s.replace(/[^\d]+/g, "");

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    const t = cnpj.length - 2,
      d = cnpj.substring(t),
      d1 = parseInt(d.charAt(0)),
      d2 = parseInt(d.charAt(1)),
      calc = (x: number) => {
        const n = cnpj.substring(0, x);
        let y = x - 7,
          s = 0,
          r = 0;

        for (let i = x; i >= 1; i--) {
          s += parseInt(n.charAt(x - i)) * y--;
          if (y < 2) y = 9;
        }

        r = 11 - (s % 11);
        return r > 9 ? 0 : r;
      };

    return calc(t) === d1 && calc(t + 1) === d2;
  }

  public removeNonDigit = (string: string) => {
    return string.replace(/[\.\-/]/gm, "");
  };

  public removeSpecialChars = (s: string) => {
    if (s === "") {
      return s;
    }
    return s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[°ª]/g, "");
  };
}

export default new Util();
