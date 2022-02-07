const path = require("path")
const visitWithParents = require("unist-util-visit-parents")

module.exports = ({ markdownNode, markdownAST }) => {
  const fileAbsoluteDir = path.dirname(markdownNode.fileAbsolutePath)
  const sourceAbsoluteDir = fileAbsoluteDir.replace(/translations\/\w{2}\//, "")

  // if it is not a source file, skip it
  if (!fileAbsoluteDir.includes("/translations")) {
    return markdownAST
  }

  visitWithParents(markdownAST, ["image"], (node) => {
    const isRelativeToMdFile = node.url.startsWith("./")
    if (isRelativeToMdFile) {
      const fileName = path.basename(node.url)
      const relativePath = path.relative(fileAbsoluteDir, sourceAbsoluteDir)
      node.url = `${relativePath}/${fileName}`
    }
  })

  return markdownAST
}
