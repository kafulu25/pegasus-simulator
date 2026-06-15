// Fix for NodeJS.Timeout type issues
declare namespace NodeJS {
  type Timeout = number;
}

// Fix for setTimeout/clearTimeout types
interface Timer {
  ref(): Timer;
  unref(): Timer;
}