const filterByValue = (array: any[], value: string) => {
    return array.filter(o =>
        Object.keys(o).some(k => o[k].toLowerCase().includes(value.toLowerCase())));
}

export default filterByValue;
