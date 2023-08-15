export default class AdminDTO {
  constructor(first_name, role) {
    this.first_name = first_name;
    this.role = role.toUpperCase();
  }
}