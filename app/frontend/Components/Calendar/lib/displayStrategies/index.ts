import { DisplayStrategyManager } from "./DisplayStrategyManager"
import { spanStrategy, splitStrategy, stackStrategy } from "../../Views/Month/displayStrategies"

// Create a new registry instance for initialization
const displayStrategyManager = new DisplayStrategyManager()

// Register all strategies
displayStrategyManager.registerStrategy("month", "split", splitStrategy)
displayStrategyManager.registerStrategy("month", "stack", stackStrategy)
displayStrategyManager.registerStrategy("month", "span", spanStrategy)

export { displayStrategyManager }
