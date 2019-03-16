const isNumber = (data) => {
    return !isNan(data) && isFinite(data);
}

export { isNumber };