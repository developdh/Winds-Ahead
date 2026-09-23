// Editorially identified female previews take priority. Keep original source
// indices and stable ordering so full-image navigation remains accurate.
export function preferredMedia(records, cosmeticId) {
  return records.filter(record => record.cosmeticId === cosmeticId)
    .sort((a, b) => Number(b.presentationSubject === 'female') - Number(a.presentationSubject === 'female'));
}
