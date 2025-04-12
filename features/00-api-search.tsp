import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Rest;
using TypeSpec.Http;
@service({
  title: "search-service",
})

namespace TypeScript.Types;

model SendType {
    userId: numeric;
    address: string;
//    filter:
}

model ResponseType {
  id: numeric;
  date: utcDateTime;
  contractBody: string;
  holders: object;
  auth: {
        jwt?: string;
    };
  historyContracts: string;
}


@route("/search")
interface dataset {
  list(): ResponseType[];
  create(@body data: SendType[]): ResponseType[];
}
