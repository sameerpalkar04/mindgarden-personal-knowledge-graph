const graphService = require("../services/graph.service");

async function getGraph(req, res) {
  try {
    const graph = await graphService.getGraph(req.user.id);

    return res.json({
      success: true,
      data: graph,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getGraph,
};