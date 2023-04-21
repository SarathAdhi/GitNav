async function main() {
  let profileName = null;

  profileName = await chrome.storage.sync.get(["github_username"]);
  profileName = profileName?.github_username || null;

  if (!profileName) {
    if (location.hash !== "https://github.com/")
      location.replace("https://github.com/");

    const username = document.querySelector(
      "span.css-truncate.css-truncate-target.ml-1"
    )?.textContent;

    await chrome.storage.sync.set({
      github_username: username,
    });

    profileName = username;
  }

  let storedLinks = await chrome.storage.sync.get(["links"]);
  storedLinks = storedLinks?.links ? JSON.parse(storedLinks.links) : "";

  if (!storedLinks) return;

  let nav = document.getElementById("global-nav");
  let navlink = document.querySelector(
    "nav#global-nav a.js-selected-navigation-item.Header-link"
  );

  nav.innerHTML = "";

  storedLinks.forEach((link) => {
    let a = navlink.cloneNode(true);

    const href = link?.href.replace(/{(.*?)}/g, profileName);
    a.href = href;
    a.innerHTML = link?.name;
    nav.appendChild(a);
  });
}
main();

let newLinks = {
  profile: {
    name: "Profile",
    href: "/{username}",
  },
  repo: {
    name: "Repositories",
    href: "/{username}?tab=repositories",
  },
  org: {
    name: "Organizations",
    href: "/settings/organizations",
  },
  pr: {
    name: "Pull requests",
    href: "/pulls",
  },
  issues: {
    name: "Issues",
    href: "/issues",
  },
};

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.from === "app.js") {
    if (message.query === "add_new_link") {
      let storage = await chrome.storage.sync.get(["links"]);

      let previousLinks = storage?.links ? JSON.parse(storage.links) : [];

      const newAnchor = JSON.parse(message.link);

      const isLinkExist = previousLinks.some((e) => e.name === newAnchor.name);

      if (isLinkExist) return;

      previousLinks?.push(newAnchor);

      await chrome.storage.sync.set({
        links: JSON.stringify(previousLinks),
      });
    }
    //
    else if (message.query === "remove_link_from_links") {
      let storage = await chrome.storage.sync.get(["links"]);

      let previousLinks = storage?.links ? JSON.parse(storage.links) : [];

      const newLinks = previousLinks.filter((e) => e.name !== message.linkName);

      await chrome.storage.sync.set({
        links: JSON.stringify(newLinks),
      });
    }
    //
    else if (message.query === "add_new_link_to_initial") {
      let storage = await chrome.storage.sync.get(["initial_links"]);

      let initialLinks = storage?.initial_links
        ? JSON.parse(storage.initial_links)
        : [];

      const newAnchor = JSON.parse(message.link);

      const isLinkExistInInitial = initialLinks.some(
        (e) => e.name === newAnchor.name
      );

      if (isLinkExistInInitial) return;

      initialLinks?.unshift(newAnchor);

      await chrome.storage.sync.set({
        initial_links: JSON.stringify(initialLinks),
      });
    }
    //
    else if (message.query === "load_preset") {
      let storedLinks = Object.values(newLinks);

      await chrome.storage.sync.set({
        links: JSON.stringify(storedLinks),
      });
    }
    //
    else if (message.query === "clear_current_profile") {
      await chrome.storage.sync.set({
        links: "",
      });

      location.reload();
    }

    main();
  }
});
