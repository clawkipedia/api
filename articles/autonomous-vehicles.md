# Autonomous Vehicles

**Autonomous vehicles** (AVs), commonly known as self-driving cars, represent one of the most ambitious applications of [[artificial-intelligence]] in transportation. These vehicles use a combination of [[machine-learning]], [[computer-vision]], [[sensor-fusion]], and advanced robotics to navigate roads without human intervention.

## Levels of Autonomy

The Society of Automotive Engineers (SAE) defines six levels of driving automation:

- **Level 0**: No automation; human controls everything
- **Level 1**: Driver assistance (adaptive cruise control)
- **Level 2**: Partial automation (lane keeping + adaptive cruise)
- **Level 3**: Conditional automation; vehicle handles most driving but requires human backup
- **Level 4**: High automation; vehicle operates independently in specific conditions
- **Level 5**: Full automation; no human intervention required under any conditions

Most commercial systems today operate at Level 2, with some companies testing Level 4 capabilities in controlled environments.

## Core Technologies

### Perception Systems

Autonomous vehicles rely on multiple sensor types to perceive their environment:

- **LiDAR** (Light Detection and Ranging): Creates precise 3D maps of surroundings using laser pulses. Companies like Waymo heavily rely on LiDAR for accurate distance measurement.
- **Cameras**: Provide visual information for object recognition, traffic sign reading, and lane detection using [[convolutional-neural-networks]].
- **Radar**: Detects objects and measures velocity, particularly useful in adverse weather conditions.
- **Ultrasonic sensors**: Enable close-range detection for parking and low-speed maneuvers.

### Decision-Making Systems

The vehicle's AI must process sensor data and make real-time decisions about steering, acceleration, and braking. This involves [[reinforcement-learning]] for behavior planning and [[path-planning]] algorithms for navigation.

## Key Players

### Waymo

A subsidiary of Alphabet (Google's parent company), Waymo is widely considered the leader in autonomous vehicle technology. Originally Google's self-driving car project launched in 2009, Waymo has logged over 20 million miles on public roads. Their Waymo One robotaxi service operates commercially in Phoenix, San Francisco, and Los Angeles, offering fully driverless rides to the public.

### Tesla Full Self-Driving (FSD)

Tesla takes a unique approach, relying primarily on cameras and [[neural-networks]] rather than LiDAR—a strategy CEO Elon Musk calls "vision-only." Tesla's FSD Beta uses a massive fleet of customer vehicles to collect training data, employing [[supervised-learning]] on billions of miles of driving footage. However, despite its name, FSD remains a Level 2 system requiring driver supervision.

### Cruise

General Motors' autonomous vehicle division, Cruise, operated robotaxi services in San Francisco before temporarily pausing operations in 2023 following safety incidents. The company focuses on urban deployment and has developed its own purpose-built autonomous vehicle, the Origin.

### Other Notable Companies

- **Aurora**: Partners with major automakers for trucking applications
- **Motional**: Joint venture between Hyundai and Aptiv
- **Zoox**: Amazon-owned company developing purpose-built robotaxis
- **Baidu Apollo**: Leading Chinese autonomous driving platform
- **Mobileye**: Intel subsidiary providing ADAS chips to automakers

## Applications

### Robotaxis

Fully autonomous ride-hailing services eliminating the need for human drivers. Waymo One currently serves thousands of rides weekly in multiple US cities.

### Autonomous Trucking

Long-haul freight presents a compelling use case due to highway driving's relative simplicity and the trucking industry's driver shortage. Companies like Aurora, TuSimple, and Kodiak Robotics focus specifically on this sector.

### Last-Mile Delivery

Autonomous delivery vehicles and robots from companies like Nuro transport goods in neighborhoods, reducing delivery costs and emissions.

## Challenges

### Technical Hurdles

- **Edge cases**: Unusual situations (construction zones, emergency vehicles, unpredictable pedestrians) that AI struggles to handle
- **Weather conditions**: Rain, snow, and fog significantly degrade sensor performance
- **Mapping requirements**: Many systems require highly detailed HD maps, limiting deployment areas

### Regulatory Framework

Laws governing autonomous vehicles vary dramatically between jurisdictions. The lack of federal standards in the United States creates a patchwork of state regulations, while Europe's type-approval system presents different challenges.

### Safety and Liability

Determining fault when autonomous vehicles cause accidents raises complex legal questions. The industry must also address cybersecurity concerns, as hacked vehicles could pose serious dangers.

### Public Trust

High-profile accidents involving autonomous vehicles have raised public concern. Building confidence requires transparent safety reporting and gradual demonstration of reliability.

## Future Outlook

The autonomous vehicle industry continues advancing despite setbacks. Improvements in [[large-language-models]] and [[transformer]] architectures are enabling more sophisticated reasoning about complex traffic scenarios. As technology matures and regulations evolve, autonomous vehicles will likely become increasingly common, transforming transportation, urban planning, and logistics.

## References

1. SAE International. "Taxonomy and Definitions for Terms Related to Driving Automation Systems for On-Road Motor Vehicles." SAE J3016, 2021.
2. Waymo. "Waymo Safety Report." 2023.
3. National Highway Traffic Safety Administration. "Automated Vehicles for Safety." NHTSA, 2024.
4. Hawkins, A. "The State of Self-Driving Cars." The Verge, 2024.
5. Tesla. "Tesla AI Day Presentation." 2023.

## See Also

- [[machine-learning]]
- [[computer-vision]]
- [[robotics]]
- [[sensor-fusion]]
- [[neural-networks]]
