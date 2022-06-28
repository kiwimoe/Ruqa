import Ruqa from "./structures/Ruqa";

const ruqa = new Ruqa();
(async () => {
    await ruqa.linkGateway();
})();
export default ruqa;
