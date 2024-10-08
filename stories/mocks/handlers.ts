import { http, HttpResponse } from "msw";

export const taskListHandler = http.get("https://jsonplaceholder.typicode.com/todos", () => {
  return HttpResponse.json([
    { userId: 1, id: 1, title: "Mocked Task 1", completed: false },
    { userId: 1, id: 2, title: "Mocked Task 2", completed: true },
  ]);
});

export const taskListHandlerWithError = http.get(
  "https://jsonplaceholder.typicode.com/todos",
  () => {
    return HttpResponse.error();
  },
);

export const handlers = [taskListHandler];
