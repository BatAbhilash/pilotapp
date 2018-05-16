export class ListItem {
  id: String;
  text: String;
  color: string;
  public constructor(source: any) {
    if (typeof source === 'string') {
      this.color = this.id = this.text = source;
    }
    if (typeof source === 'object') {
      this.id = source.id;
      this.text = source.text;
      this.color = source.color;
    }
  }
}
export class MyException {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    this.status = status;
    this.body = body;
  }
}
