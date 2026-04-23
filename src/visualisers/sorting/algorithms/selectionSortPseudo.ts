export const selectionSortPseudo = [
  'for i from 0 to n - 1',
  '  min_index = i            ',
  '  for j from 0 to n - i - 1',
  '    if arr[j] > arr[min_index]',
  '      min_index = j',
  '  temp = arr[i]',
  '  arr[i] = arr[min_index]',
  '  arr[min_index] = temp',
]