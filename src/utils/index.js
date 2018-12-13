export const titleCaseCategories = value => {
  let formattedCat

  if (value.includes('-')) {
    formattedCat = value
      .split('-')
      .map(w => w[0].toUpperCase() + w.substring(1))
      .join(' ')
  } else {
    formattedCat = value[0].toUpperCase() + value.substring(1)
  }

  return formattedCat
}
