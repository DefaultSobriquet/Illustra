import config from "./config.js";
import IllustraClient from "./structures/IllustraClient";

const Illustra = new IllustraClient({config});

Illustra.init();