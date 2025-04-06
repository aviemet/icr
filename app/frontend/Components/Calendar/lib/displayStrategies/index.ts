import { DisplayStrategyRegistry } from "./DisplayStrategyRegistry"
import { spanStrategy, splitStrategy, stackStrategy } from "../../Views/Month/displayStrategies"

export * from "./DisplayStrategyRegistry"

// Create a new registry instance for initialization
const displayStrategyRegistry = new DisplayStrategyRegistry()

// Register all strategies
displayStrategyRegistry.register("month", "split", splitStrategy)
displayStrategyRegistry.register("month", "stack", stackStrategy)
displayStrategyRegistry.register("month", "span", spanStrategy)

export { displayStrategyRegistry }
