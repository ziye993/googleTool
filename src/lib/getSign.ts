import md5 from "js-md5";

export default function getSign(text:string) {
  const hash = md5(text);

  return hash;
}
