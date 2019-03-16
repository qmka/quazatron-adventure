const isNumber = (data) => {
    return !isNaN(data) && isFinite(data);
}

export { isNumber };