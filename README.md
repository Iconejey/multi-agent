# Evolution of an epidemic disease with different sanitary measures in a multi-agent system.

## Summary

-   [Introduction](#introduction)
-   [Model](#model)
-   [Epidemic](#epidemic)
-   Sanitary measures
    -   Barrier actions
    -   Social distancing
    -   Lockdown
    -   Vaccination
    -   Combinations
-   Conclusion

## Introduction

This study is about the evolution of a non-lethal epidemic disease in a multi-agent system. The government will use different sanitary measures in order to:

-   Prevent **hospital overload**, here defined by more than **20%** of the population being infected.
-   Limit the **total amount of infections** during the studied period.
-   **Eradicate** the disease.

We will see how the different measures affect the evolution of the disease and how they help to achieve theses goals.

## Model

The model is based on the [SIRV model](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology#The_SIRV_model). We have a square-shaped world of size 20 and 1000 agents represented by a circle of diameter 1. The agents are distributed randomly in the world and move with random direction and acceleration. The agents are divided in four groups:

-   <span style="color:#7fa5f8">**Susceptible**</span> (in blue)
-   <span style="color:#dc6b73">**Infected**</span> (in red)
-   <span style="color:#bade87">**Recovered**</span> (in green)
-   <span style="color:#ffcb6c">**Vaccinated**</span> (in yellow)

Here is a short video of the model at 1 day / 1 second:

<video src="https://github.com/Iconejey/multi-agent/blob/main/Results/model.mp4?raw=true" width="500px" controls></video>

## Epidemic

Among the population of 1000 agents, **10** agents are <span style="color:#dc6b73">**infected**</span> at the beginning of the simulation. They are contagious and can infect <span style="color:#7fa5f8">**susceptible**</span> agents. The probability of getting infected is **8%** per day of contact so if a <span style="color:#7fa5f8">**susceptible**</span> agent is in contact with an <span style="color:#dc6b73">**infected**</span> agent for half a day, there is a **4%** chance that the <span style="color:#7fa5f8">**susceptible**</span> agent gets <span style="color:#dc6b73">**infected**</span>.

The disease is not lethal and the recovery time is between **20** and **30** days after which the <span style="color:#dc6b73">**infected**</span> agent will be <span style="color:#bade87">**recovered**</span> and immune to the disease for the next **60** to **90** days (about 2 to 3 months) before becoming <span style="color:#7fa5f8">**susceptible**</span> again.

<span style="color:#7fa5f8">**Susceptible**</span> agents can become <span style="color:#ffcb6c">**Vaccinated**</span> depending on the [vaccination](#vaccination) policy implemented by the government. In this case the agent has **90%** less chance of getting infected. The vaccine is effective for the next **120** to **180** days (about 4 to 6 months) after which the agent will be <span style="color:#7fa5f8">**susceptible**</span> again.

Here is a graph of the number of <span style="color:#7fa5f8">**susceptible**</span>, <span style="color:#dc6b73">**infected**</span> and <span style="color:#bade87">**recovered**</span> agents during the simulation of 4 years without any sanitary measures:

<p align="center">
<img src="https://github.com/Iconejey/multi-agent/blob/main/Results/Number%20of%20people%20as%20a%20function%20of%20time.jpg?raw=true"/>
</p>

We can see that the number of infected agents peaks at **366** in 2 months. This is more than **1/3** of the population. That means that there is a massive **hospital overload** with **166** people over the limit of **20%** of the population. There is a total of **10** peaks of infected agents during the 4 years and all of them are above this limit.

The total number of infections is **8285** which means all the agents are infected **8.3** times in average during the 4 years period.

As expected, the disease was not eradicated.
