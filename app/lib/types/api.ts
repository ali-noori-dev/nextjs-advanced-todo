export type RouteHandlerParams<T> = {
  params: T;
};

export type TaskRouteParams = RouteHandlerParams<{
  id: string;
}>;
