import { AxiosInstance } from "axios";
import { stringify } from "query-string";
import { DataProvider } from "@pankod/refine-core";
import {
  generateFilter,
  generateSort,
  axiosInstance,
} from "@pankod/refine-simple-rest";
import { getEndpoint } from "endpoints";
const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
  getList: async ({
    resource,
    hasPagination = true,
    pagination = { current: 1, pageSize: 10 },
    filters,
    sort,
  }) => {
    let url = `${apiUrl}/${getEndpoint(resource, "GET")}`;

    const { current = 1, pageSize = 10 } = pagination ?? {};

    const queryFilters = generateFilter(filters);

    const query: {
      skip?: number;
      limit?: number;
      _sort?: string;
      _order?: string;
    } = hasPagination
      ? {
          skip: (current - 1) * pageSize,
          limit: pageSize,
        }
      : {};

    const generatedSort = generateSort(sort);
    if (generatedSort) {
      const { _sort, _order } = generatedSort;
      query._sort = _sort.join(",");
      query._order = _order.join(",");
    }

    const { data } = await httpClient.get(
      `${url}?${stringify(query)}&${stringify(queryFilters)}`
    );

    const total = data.data?.length;
    return {
      data: data?.data,
      total,
    };
  },

  getMany: async ({ resource, ids }) => {
    const { data } = await httpClient.get(
      `${apiUrl}/${resource}?${stringify({ id: ids })}`
    );

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${getEndpoint(resource, "POST")}`;

    const { data } = await httpClient.post(url, variables);

    return {
      data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${getEndpoint(resource, "PUT")}`;
    if (resource.endsWith("s")) {
      resource = resource.slice(0, -1);
    }
    const { data } = await httpClient.put(url, {
      ...variables,
      [`${resource}_uuid`]: id,
    });

    return {
      data,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${getEndpoint(resource, "GET")}/${id}`;

    const { data } = await httpClient.get(url);

    if (!!data?.status_code && !!data?.data) {
      return {
        data: data?.data,
      };
    }

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${getEndpoint(resource, "PATCH")}/${id}`;

    const { data } = await httpClient.patch(url, { status: "CANCELLED" });

    return {
      data,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({ url, method, filters, sort, payload, query, headers }) => {
    let requestUrl = `${url}?`;

    if (sort) {
      const generatedSort = generateSort(sort);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        const sortQuery = {
          _sort: _sort.join(","),
          _order: _order.join(","),
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headers,
      };
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload);
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          data: payload,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
});

export default dataProvider;
