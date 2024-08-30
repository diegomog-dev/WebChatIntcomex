export default async function reqApi(parameter, count, numberPage){
    const api = await fetch(`http://localhost:5162/api/Product/GetSearchProducts?parameter=${parameter}&count=${count}&numberPage=${numberPage}`);
    const productApi = await api.json();
    return productApi;
}