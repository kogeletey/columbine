import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Rest;
using TypeSpec.Http;
@service({
  title: "analytic-service",
})

namespace TypeScript.Types;

model SendType {
    id: numeric;
    address: string;
}


model ResponseType {
    id: numeric,
    address: string;
    totalSupply: string;
    marketCap: string;
    holders: object[];
    links: string[];
    scanLink: string;
    date: utcDateTime;
    transfers: string[]
    score: numeric;
    volume: string;
}
