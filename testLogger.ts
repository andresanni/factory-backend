import logger from "./src/utils/logger";

logger.info("This is an info message");
logger.error("This is an error message");
logger.debug("This is a debug message");
logger.warn("This is a warn message");

logger.info("This is an info message", {
  operation: "test",
  method: "test",
  error: new Error("This is a test error"),
});

logger.error("This is a test error", new Error("error message"));
