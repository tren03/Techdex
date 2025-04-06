name: Add Person
description: Submit a person to be added to ppl.json
title: "Add: "
labels: [add_person]
body:
  - type: input
    id: name
    attributes:
      label: Name
      placeholder: Ada Lovelace
    validations:
      required: true
  - type: input
    id: url
    attributes:
      label: Profile URL
      placeholder: https://example.com/ada
    validations:
      required: true
