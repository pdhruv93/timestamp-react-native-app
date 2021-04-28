const config = {
    screens: {
        TimestampToggler: {
        path: "/toggle",
      },
    },
  };
  
  const linking = {
    prefixes: ["timestamp://toggle"],
    config,
  };
  
  export default linking;