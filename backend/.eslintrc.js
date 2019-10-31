module.exports = {
    root: true,
    env: {
        node: true
    },
    overrides: [
        {
            "files": ["datamodel.prisma"],
            "processor": "a-plugin/markdown"
        }
    ]
}
