const getParameter = (): number => {
  if ('points' in window.germesInfo.selection) {
    return window.germesInfo.selection.points;
  }
  return -6666;
};

export default getParameter;
