type GetMapType = {
  appointments: string;
  housekeepers: string;
  jobs: string;
  customer: string;
  customerAddress: string;
};

type PostMapType = {
  appointments: string;
  customerAddress: string;
};

type PutMapType = {
  customer: string;
};

type PatchMapType = {
  appointments: string;
};

type DeleteMapType = {
  address: string;
};

export const getMap: GetMapType = {
  appointments: "appointment-api/http/appointments",
  housekeepers: "housekeeper-api/housekeepers",
  jobs: "appointment-api/http/jobs",
  customer: "customer-api/api/customers", // continue with /{customerId}
  customerAddress: "customer-api/api/addresses/customers", // continue with /{customerId}
};

export const postMap: PostMapType = {
  appointments: "appointment-api/http/appointments",
  customerAddress: `customer-api/api/customers`, // continue with /{customerId}/addresses
};

export const putMap: PutMapType = {
  customer: "customer-api/api/customers",
};

export const patchMap: PatchMapType = {
  appointments: "appointment-api/http/appointments",
};

export const deleteMap: DeleteMapType = {
  address: "customer-api/api/addresses",
};

export const getEndpoint = (resource: string, method: string): string => {
  switch (method.toUpperCase()) {
    case "GET":
      if (resource in getMap) {
        return getMap[resource as keyof GetMapType];
      }
      break;
    case "POST":
      if (resource in postMap) {
        return postMap[resource as keyof PostMapType];
      }
      break;
    case "PUT":
      if (resource in putMap) {
        return putMap[resource as keyof PutMapType];
      }
      break;
    case "PATCH":
      if (resource in patchMap) {
        return patchMap[resource as keyof PatchMapType];
      }
      break;
    case "DELETE":
      if (resource in deleteMap) {
        return deleteMap[resource as keyof DeleteMapType];
      }
      break;
    default:
      throw new Error("Method not supported");
  }
  throw new Error("Resource not found");
};
